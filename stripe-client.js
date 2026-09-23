// SiteFresh Stripe Checkout - client-side
// Uses Stripe Payment Link for zero-backend checkout
// Optionally uses Stripe Checkout Session for more control

export async function startSubscription(email) {
  // Option 1: Stripe Payment Link (simplest - no backend)
  // Redirect to Stripe-hosted checkout page
  const url = new URL(STRIPE_PAYMENT_LINK_URL);
  if (email) {
  url.searchParams.set('prefilled_email', email);
  }
  window.location.href = url.toString();
}

// ============================================================
// Alternative: Stripe Checkout Session (requires backend)
// ============================================================
// To use this instead, uncomment and create the API route:
//
// export async function createCheckoutSession(email, successUrl, cancelUrl) {
// const response = await fetch('/api/create-checkout', {
//   method: 'POST',
//   headers: { 'Content-Type': 'application/json' },
//   body: JSON.stringify({ email, successUrl, cancelUrl })
// });
// const { url } = await response.json();
// if (url) window.location.href = url;
// }

import { STRIPE_PAYMENT_LINK_URL } from './stripe-config.js';
