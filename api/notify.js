// SiteFresh Lead Notification Webhook
// Receives lead notifications from the client and emails team@sitefresh.co
// Uses Resend (or any SMTP service) to send the email
// Environment variables needed in Vercel:
//   RESEND_API_KEY or SMTP_URL
//   NOTIFICATION_EMAIL (default: team@sitefresh.co)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { type, auditedUrl, auditScore, auditGrade, question, email, timestamp } = req.body;

  const notifyEmail = process.env.NOTIFICATION_EMAIL || 'team@sitefresh.co';
  const apiKey = process.env.RESEND_API_KEY || process.env.SMTP_URL;

  if (!apiKey) {
    // No email service configured - log and return success (lead is in DB)
    console.log('[SiteFresh Notify] No API key configured. Lead:', { type, auditedUrl, question, email });
    return res.status(200).json({ ok: true, notified: false, reason: 'no_email_service' });
  }

  let subject, body;

  if (type === 'audit') {
    subject = `🔥 Hot Lead: New Audit - ${auditedUrl}`;
    body = [
      `New audit lead on sitefresh.co`,
      ``,
      `Website audited: ${auditedUrl}`,
      `Score: ${auditScore}/100 (Grade: ${auditGrade})`,
      `Time: ${timestamp}`,
      ``,
      `This is a hot lead - they audited their own site.`,
      `Follow up with a personalized audit summary.`,
    ].join('\n');
  } else if (type === 'chat') {
    subject = `💬 Chat Lead: Question from ${email || 'anonymous user'}`;
    body = [
      `New chat lead on sitefresh.co`,
      ``,
      `Question asked: ${question}`,
      `Email: ${email || 'Not provided'}`,
      `Time: ${timestamp}`,
      ``,
      `This person asked a question the FAQ couldn't answer.`,
      `Reply with a personalized answer.`,
    ].join('\n');
  } else {
    subject = `📝 New Lead on sitefresh.co`;
    body = JSON.stringify(req.body, null, 2);
  }

  try {
    // Try Resend first
    if (process.env.RESEND_API_KEY) {
      const resp = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'notifications@sitefresh.co',
          to: notifyEmail,
          subject,
          text: body,
        }),
      });

      if (resp.ok) {
        return res.status(200).json({ ok: true, notified: true });
      }
      console.error('[SiteFresh Notify] Resend error:', await resp.text());
    }

    // Fallback: just log
    console.log('[SiteFresh Notify] Email body:', body);
    return res.status(200).json({ ok: true, notified: false, reason: 'fallback' });
  } catch (err) {
    console.error('[SiteFresh Notify] Error:', err);
    return res.status(200).json({ ok: true, notified: false, reason: 'error' });
  }
}
