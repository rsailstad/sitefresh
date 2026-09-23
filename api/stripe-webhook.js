// SiteFresh Stripe Webhook Handler (Vercel Serverless Function)
// Deploy at: /api/stripe-webhook
// 
// Setup:
// 1. In Stripe Dashboard → Developers → Webhooks → Add endpoint:
//    URL: https://sitefresh.co/api/stripe-webhook
//    Events: checkout.session.completed, customer.subscription.deleted
// 2. Copy the signing secret (whsec_...) into stripe-config.js
// 3. Copy your Supabase service_role key into stripe-config.js

import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_YOUR_KEY');
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_YOUR_SECRET';

const supabase = createClient(
  process.env.SUPABASE_URL || 'https://xesrcsbwenjqiukjvllk.supabase.co',
  process.env.SUPABASE_SERVICE_KEY || 'YOUR_SERVICE_KEY'
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get the raw body — Stripe needs this for signature verification
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
      // ============================================================
      // CHECKOUT COMPLETED — mark subscriber as paid
      // ============================================================
      case 'checkout.session.completed': {
        const session = event.data.object;
        const email = session.customer_email || session.customer_details?.email;
        const stripeCustomerId = session.customer;

        if (email) {
          // Find subscriber by email and update to paid
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
          } else {
            // If subscriber doesn't exist yet, insert by auth user email
            const { data: authUser } = await supabase.auth.admin
              .listUsers();
            
            const user = authUser?.users?.find(u => u.email === email);
            if (user) {
              await supabase
                .from('subscribers')
                .update({ 
                  subscription_tier: 'paid',
                  stripe_customer_id: stripeCustomerId,
                  updated_at: new Date().toISOString()
                })
                .eq('id', user.id);
            }
          }
        }
        break;
      }

      // ============================================================
      // SUBSCRIPTION CANCELLED — downgrade to free
      // ============================================================
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

      // ============================================================
      // SUBSCRIPTION UPDATED — handle plan changes / renewals
      // ============================================================
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
        // Unhandled event type — log but don't error
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (err) {
    console.error('Webhook handler error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
