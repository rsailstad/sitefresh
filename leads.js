// SiteFresh Lead Tracking
// Two lead types: audit (URL entered) and chat (question the FAQ couldn't answer)
// Uses Supabase anon key for inserts - safe to expose (RLS allows insert only)

const SITEFRESH_LEADS = (function () {
  const SUPABASE_URL = 'https://xesrcsbwenjqiukjvllk.supabase.co';
  const SUPABASE_ANON_KEY = 'sb_publishable_6oBfSqzwkNDRy7dLF_Aa0Q_Kan7yER3';
  const NOTIFY_EMAIL = 'team@sitefresh.co';

  async function insertLead(leadData) {
    try {
      const payload = {
        type: leadData.type || 'contact',
        audited_url: leadData.auditedUrl || null,
        audit_score: leadData.auditScore || null,
        audit_grade: leadData.auditGrade || null,
        question: leadData.question || null,
        email: leadData.email || null,
        name: leadData.name || null,
        referrer: typeof window !== 'undefined' ? window.location.href : null,
        user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
        status: 'new',
      };

      const resp = await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        console.error('[SiteFresh Leads] Insert failed:', resp.status, resp.statusText);
        return false;
      }

      // Send notification email via mailto (opens user's email client)
      // For server-side email, use the webhook endpoint
      if (leadData.type === 'audit') {
        sendAuditNotification(leadData);
      } else if (leadData.type === 'chat') {
        sendChatNotification(leadData);
      }

      return true;
    } catch (err) {
      console.error('[SiteFresh Leads] Error:', err);
      return false;
    }
  }

  function sendAuditNotification(leadData) {
    // Use a serverless function or mailto for notification
    // The webhook at /api/notify.js handles the actual email send
    fetch('/api/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'audit',
        auditedUrl: leadData.auditedUrl,
        auditScore: leadData.auditScore,
        auditGrade: leadData.auditGrade,
        timestamp: new Date().toISOString(),
      }),
    }).catch(() => {
      // Silent fail - the lead is still in the database
    });
  }

  function sendChatNotification(leadData) {
    fetch('/api/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'chat',
        question: leadData.question,
        email: leadData.email,
        timestamp: new Date().toISOString(),
      }),
    }).catch(() => {
      // Silent fail - the lead is still in the database
    });
  }

  // Track audit: called when someone enters a URL to audit
  async function trackAudit(url, score, grade) {
    return insertLead({
      type: 'audit',
      auditedUrl: url,
      auditScore: score,
      auditGrade: grade,
    });
  }

  // Track chat question: called when the chat widget can't answer a question
  async function trackChatQuestion(question, email) {
    return insertLead({
      type: 'chat',
      question: question,
      email: email,
    });
  }

  return {
    trackAudit,
    trackChatQuestion,
    insertLead,
  };
})();

if (typeof window !== 'undefined') {
  window.SITEFRESH_LEADS = SITEFRESH_LEADS;
}
