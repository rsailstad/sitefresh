-- SiteFresh Lead Tracking Schema
-- Two lead types: audit (someone ran the audit tool) and chat (someone asked a question the FAQ couldn't answer)
-- RLS: anyone can insert (submit leads), only authenticated can read

CREATE TABLE IF NOT EXISTS leads (
  id BIGSERIAL PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('audit', 'chat', 'contact')),
  -- For audit leads: the URL they audited + their score
  audited_url TEXT,
  audit_score INTEGER,
  audit_grade TEXT,
  -- For chat leads: the question they asked + their email
  question TEXT,
  -- Common
  email TEXT,
  name TEXT,
  -- Metadata
  referrer TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- Status: new, contacted, converted, archived
  status TEXT NOT NULL DEFAULT 'new',
  notes TEXT
);

-- Index for sorting by newest
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads (status);
CREATE INDEX IF NOT EXISTS idx_leads_type ON leads (type);

-- RLS: allow inserts from anyone (anon key), restrict reads to authenticated
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Anyone can insert a lead (the anon key is safe to expose)
CREATE POLICY "Anyone can insert leads"
  ON leads FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only authenticated users can read leads (Rob checks dashboard)
CREATE POLICY "Authenticated can read leads"
  ON leads FOR SELECT
  TO authenticated
  USING (true);

-- Only authenticated can update status/notes
CREATE POLICY "Authenticated can update leads"
  ON leads FOR UPDATE
  TO authenticated
  USING (true);
