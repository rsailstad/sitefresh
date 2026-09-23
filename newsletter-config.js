// SiteFresh Newsletter Config
// Replace these with your Supabase project values
// Get them from: Supabase Dashboard → Settings → API

export const SUPABASE_URL = 'https://xesrcsbwenjqiukjvllk.supabase.co';
export const SUPABASE_ANON_KEY = 'sb_publishable_6oBfSqzwkNDRy7dLF_Aa0Q_Kan7yER3';

// ============================================================
// Supabase client initialization (lazy-loaded)
// ============================================================
let _client = null;

export async function getClient() {
  if (_client) return _client;
  const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
  _client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  return _client;
}

// ============================================================
// Auth helpers
// ============================================================

export async function signUp(email, password, industry) {
  const supabase = await getClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { industry },
      emailRedirectTo: 'https://sitefresh.co/login.html'
    }
  });
  if (error) throw error;
  return data;
}

export async function signIn(email, password) {
  const supabase = await getClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const supabase = await getClient();
  await supabase.auth.signOut();
}

export async function getCurrentUser() {
  const supabase = await getClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  
  // Fetch subscriber profile
  const { data: profile } = await supabase
    .from('subscribers')
    .select('*')
    .eq('id', user.id)
    .single();
  
  return { user, profile };
}

// ============================================================
// Newsletter helpers
// ============================================================

export async function getIndustries() {
  const supabase = await getClient();
  const { data, error } = await supabase
    .from('industries')
    .select('*')
    .order('display_order');
  if (error) throw error;
  return data;
}

export async function getLatestIssue() {
  const supabase = await getClient();
  const { data, error } = await supabase
    .from('newsletter_issues')
    .select('*')
    .eq('is_published', true)
    .order('published_date', { ascending: false })
    .limit(1)
    .single();
  if (error) return null;
  return data;
}

export async function getIndustryIdeas(issueId, industry) {
  const supabase = await getClient();
  const { data, error } = await supabase
    .from('industry_ideas')
    .select('*')
    .eq('issue_id', issueId)
    .or(`industry.eq.${industry},industry.eq.general`)
    .order('display_order');
  if (error) throw error;
  return data;
}

export async function getAllIssues() {
  const supabase = await getClient();
  const { data, error } = await supabase
    .from('newsletter_issues')
    .select('id, issue_number, title, subtitle, published_date')
    .eq('is_published', true)
    .order('published_date', { ascending: false });
  if (error) throw error;
  return data;
}
