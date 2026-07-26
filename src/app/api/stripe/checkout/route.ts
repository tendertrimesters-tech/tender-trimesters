import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getStripe, STRIPE_PRICES, getSuccessUrl, getCancelUrl, isStripeConfigured } from "@/lib/stripe";
import { db } from "@/lib/db";

// POST /api/stripe/checkout
// Body: { tier: "one_time" | "monthly" }
// Creates a Stripe Checkout Session and returns its URL so the client can redirect.
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const tier = body?.tier as "one_time" | "monthly";
  if (!tier || !["one_time", "monthly"].includes(tier)) {
    return NextResponse.json({ error: "Valid tier required (one_time or monthly)" }, { status: 400 });
  }

  const stripe = getStripe();
  if (!stripe || !isStripeConfigured()) {
    return NextResponse.json(
      { error: "Stripe is not configured. Set STRIPE_SECRET_KEY and price IDs in your environment." },
      { status: 503 }
    );
  }

  const priceId = STRIPE_PRICES[tier];
  if (!priceId) {
    return NextResponse.json(
      { error: `Missing price ID for tier "${tier}". Set STRIPE_${tier.toUpperCase()}_PRICE_ID.` },
      { status: 503 }
    );
  }

  // Look up the user so we can pass their email to Stripe (makes the receipt nicer
  // and lets us match customers later).
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, email: true, name: true, stripeCustomerId: true },
  });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: tier === "one_time" ? "payment" : "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    customer_email: user.email,
    client_reference_id: user.id,
    metadata: {
      userId: user.id,
      tier,
    },
    success_url: getSuccessUrl(),
    cancel_url: getCancelUrl(),
    allow_promotion_codes: true,
    billing_address_collection: "auto",
  });

  return NextResponse.json({ url: checkoutSession.url });
}
