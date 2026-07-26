import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { db } from "@/lib/db";

// POST /api/stripe/webhook
// Receives Stripe events. The critical one for us is `checkout.session.completed`,
// which fires after a successful payment (one-time) or subscription start (monthly).
// We verify the signature, then flip the user's isPremium flag.

// IMPORTANT: the body must be the raw request body (not JSON-parsed) for Stripe
// signature verification to work. Next.js Route Handlers expose this via
// req.text() on a POST route without a JSON body parser configured.

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 503 });
  }

  const body = await req.text();
  const signature = (await headers()).get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[stripe/webhook] signature verification failed:", message);
    return NextResponse.json({ error: `Invalid signature: ${message}` }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const cs = event.data.object as Stripe.Checkout.Session;
        const userId = cs.metadata?.userId || cs.client_reference_id;
        const tier = cs.metadata?.tier as "one_time" | "monthly" | undefined;

        if (!userId || !tier) {
          console.error("[stripe/webhook] missing userId or tier in session metadata", cs.id);
          return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
        }

        // Idempotency: if user already premium with this session id, skip.
        const existing = await db.user.findUnique({
          where: { id: userId },
          select: { id: true, isPremium: true, stripeCheckoutSessionId: true },
        });
        if (!existing) {
          console.error("[stripe/webhook] user not found:", userId);
          return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        if (existing.stripeCheckoutSessionId === cs.id) {
          // Already processed. Stripe may resend events; that's fine.
          return NextResponse.json({ received: true, deduplicated: true });
        }

        const subscriptionId = typeof cs.subscription === "string" ? cs.subscription : null;
        const customerId = typeof cs.customer === "string" ? cs.customer : null;

        await db.user.update({
          where: { id: userId },
          data: {
            isPremium: true,
            premiumTier: tier,
            premiumSince: new Date(),
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscriptionId,
            stripeCheckoutSessionId: cs.id,
          },
        });

        console.log(`[stripe/webhook] premium activated for ${userId} (${tier})`);
        break;
      }

      case "customer.subscription.deleted": {
        // Monthly subscriber cancelled — revoke premium.
        const sub = event.data.object as Stripe.Subscription;
        const customerId = typeof sub.customer === "string" ? sub.customer : null;
        if (!customerId) break;
        const user = await db.user.findFirst({
          where: { stripeCustomerId: customerId },
          select: { id: true },
        });
        if (user) {
          await db.user.update({
            where: { id: user.id },
            data: {
              isPremium: false,
              premiumTier: null,
              stripeSubscriptionId: null,
            },
          });
          console.log(`[stripe/webhook] premium revoked for ${user.id} (subscription deleted)`);
        }
        break;
      }

      default:
        // Ignore events we don't care about (invoice.paid, etc.)
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[stripe/webhook] handler error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
