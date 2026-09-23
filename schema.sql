-- SiteFresh Newsletter Database Schema
-- Run this in Supabase SQL Editor after creating the project

-- ============================================================
-- SUBSCRIBERS - extends Supabase auth.users with profile data
-- ============================================================
CREATE TABLE public.subscribers (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  industry TEXT NOT NULL DEFAULT 'general',
  subscription_tier TEXT NOT NULL DEFAULT 'free', -- 'free' | 'paid'
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Users can only read/update their own profile
CREATE POLICY "Subscribers can read own profile" ON public.subscribers
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Subscribers can update own profile" ON public.subscribers
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Subscribers can insert own profile" ON public.subscribers
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================================
-- NEWSLETTER ISSUES - each issue's content
-- ============================================================
CREATE TABLE public.newsletter_issues (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  issue_number INTEGER NOT NULL UNIQUE,
  title TEXT NOT NULL,
  subtitle TEXT,
  published_date DATE NOT NULL,
  is_published BOOLEAN DEFAULT FALSE,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  -- content structure:
  -- {
  -- "intro": "markdown text",
  -- "sections": [
  --   { "heading": "...", "body": "...", "sources": [{"title": "...", "url": "..."}] }
  -- ]
  -- }
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- All authenticated users can read published issues
ALTER TABLE public.newsletter_issues ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read published issues" ON public.newsletter_issues
  FOR SELECT USING (is_published = true);

-- ============================================================
-- INDUSTRY IDEAS - 5 personalized ideas per industry per issue
-- ============================================================
CREATE TABLE public.industry_ideas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  issue_id UUID REFERENCES public.newsletter_issues(id) ON DELETE CASCADE,
  industry TEXT NOT NULL,
  idea_title TEXT NOT NULL,
  idea_body TEXT NOT NULL,
  consulting_service TEXT NOT NULL,
  consulting_price INTEGER, -- in USD, nullable for custom quotes
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- All authenticated users can read ideas for published issues
ALTER TABLE public.industry_ideas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read published ideas" ON public.industry_ideas
  FOR SELECT USING (
  EXISTS (
  SELECT 1 FROM public.newsletter_issues
  WHERE id = industry_ideas.issue_id AND is_published = true
  )
  );

-- ============================================================
-- INDUSTRIES - lookup table for signup dropdown
-- ============================================================
CREATE TABLE public.industries (
  id TEXT PRIMARY KEY, -- 'roofing', 'dental', 'restaurant', etc.
  label TEXT NOT NULL, -- 'Roofing Contractor'
  icon TEXT DEFAULT '🔧',
  display_order INTEGER DEFAULT 0
);

ALTER TABLE public.industries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read industries" ON public.industries
  FOR SELECT USING (true);

-- Seed initial industries
INSERT INTO public.industries (id, label, icon, display_order) VALUES
  ('roofing', 'Roofing Contractor', '🏠', 1),
  ('dental', 'Dental Practice', '🦷', 2),
  ('realestate', 'Real Estate Agency', '🏡', 3),
  ('restaurant', 'Restaurant / Café', '🍽️', 4),
  ('legal', 'Legal Services', '⚖️', 5),
  ('automotive', 'Auto Repair / Dealer', '🚗', 6),
  ('fitness', 'Fitness / Gym', '💪', 7),
  ('landscaping', 'Landscaping / Lawn Care', '🌿', 8),
  ('plumbing', 'Plumbing / HVAC', '🔧', 9),
  ('healthcare', 'Healthcare / Medical', '🏥', 10),
  ('beauty', 'Beauty / Salon / Spa', '💅', 11),
  ('general', 'Other / General Business', '🏢', 99)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- HELPER: Auto-create subscriber profile on signup
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.subscribers (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
