// Stripe server-side client (singleton).
// Returns null if STRIPE_SECRET_KEY is not configured — in that case the app
// falls back to dev-mode mock premium activation so you can still test locally.

import Stripe from "stripe";

let _stripe: Stripe | null = null;
let _checked = false;

export function getStripe(): Stripe | null {
  if (_checked) return _stripe;
  _checked = true;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  _stripe = new Stripe(key, {
    apiVersion: "2025-08-27.basil" as Stripe.LatestApiVersion,
    typescript: true,
  });
  return _stripe;
}

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

// Price IDs for the two premium tiers. You'll get these from your Stripe Dashboard
// (Products → click product → copy price ID starting with "price_...").
export const STRIPE_PRICES = {
  one_time: process.env.STRIPE_ONE_TIME_PRICE_ID, // $9.99 one-time
  monthly: process.env.STRIPE_MONTHLY_PRICE_ID, // $4.99/month
  ebook: process.env.STRIPE_EBOOK_PRICE_ID, // ebook standalone
} as const;

export type StripeTier = keyof typeof STRIPE_PRICES;

// The URL the user is sent to after successful payment.
// In production this should be your live domain.
export function getSuccessUrl(): string {
  const base = process.env.NEXTAUTH_URL || "http://localhost:3000";
  return `${base}/?premium=success`;
}

export function getCancelUrl(): string {
  const base = process.env.NEXTAUTH_URL || "http://localhost:3000";
  return `${base}/?premium=cancelled`;
}
