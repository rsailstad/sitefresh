// SiteFresh Stripe Webhook Handler (Vercel Serverless Function)
// Deploy at: /api/stripe-webhook
//
// Setup:
// 1. Set these Vercel environment variables:
//    - STRIPE_SECRET_KEY (sk_live_... or sk_test_...)
//    - STRIPE_WEBHOOK_SECRET (whsec_...)
//    - SUPABASE_SERVICE_KEY (sb_secret_...)
// 2. In Stripe Dashboard → Developers → Webhooks → Add endpoint:
//    URL: https://sitefresh.co/api/stripe-webhook
//    Events: checkout.session.completed, customer.subscription.deleted, customer.subscription.updated

import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

const supabase = createClient(
  'https://xesrcsbwenjqiukjvllk.supabase.co',
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const rawBody = JSON.stringify(req.body);
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, stripeWebhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const email = session.customer_email || session.customer_details?.email;
        const stripeCustomerId = session.customer;

        if (email) {
          const { data: existing } = await supabase
            .from('subscribers')
            .select('id')
            .eq('email', email)
            .single();

          if (existing) {
            await supabase
              .from('subscribers')
              .update({
                subscription_tier: 'paid',
                stripe_customer_id: stripeCustomerId,
                updated_at: new Date().toISOString()
              })
              .eq('id', existing.id);
          }
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const stripeCustomerId = subscription.customer;

        await supabase
          .from('subscribers')
          .update({
            subscription_tier: 'free',
            updated_at: new Date().toISOString()
          })
          .eq('stripe_customer_id', stripeCustomerId);

        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const status = subscription.status;
        const stripeCustomerId = subscription.customer;

        if (status === 'active' || status === 'trialing') {
          await supabase
            .from('subscribers')
            .update({
              subscription_tier: 'paid',
              updated_at: new Date().toISOString()
            })
            .eq('stripe_customer_id', stripeCustomerId);
        } else if (status === 'canceled' || status === 'unpaid' || status === 'incomplete_expired') {
          await supabase
            .from('subscribers')
            .update({
              subscription_tier: 'free',
              updated_at: new Date().toISOString()
            })
            .eq('stripe_customer_id', stripeCustomerId);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (err) {
    console.error('Webhook handler error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
