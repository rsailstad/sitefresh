// SiteFresh Stripe Configuration
// Get these from your Stripe Dashboard → Developers → API Keys

export const STRIPE_PUBLISHABLE_KEY = 'pk_test_YOUR_KEY';
export const STRIPE_PAYMENT_LINK_URL = 'https://buy.stripe.com/YOUR_PAYMENT_LINK';

// Stripe Price ID for the $29.99/month newsletter subscription
// Create this in Stripe Dashboard → Products → Create Product → Recurring → $29.99/month
export const STRIPE_PRICE_ID = 'price_YOUR_PRICE_ID';

// Webhook secret — get from Stripe Dashboard → Developers → Webhooks → create endpoint
// Endpoint URL: https://sitefresh.co/api/stripe-webhook
export const STRIPE_WEBHOOK_SECRET = 'whsec_YOUR_WEBHOOK_SECRET';

// Supabase service role key — get from Supabase Dashboard → Settings → API → service_role
// This is used ONLY server-side in the webhook to update subscriber status
export const SUPABASE_SERVICE_KEY = 'YOUR_SERVICE_ROLE_KEY';
