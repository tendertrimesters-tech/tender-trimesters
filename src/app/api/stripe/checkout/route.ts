import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getStripe, STRIPE_PRICES, getSuccessUrl, getCancelUrl, isStripeConfigured } from "@/lib/stripe";
import { db } from "@/lib/db";

// POST /api/stripe/checkout
// Body: { tier: "one_time" | "monthly" } — requires auth
// Body: { tier: "ebook", email: string, name: string } — no auth needed
export async function POST(req: NextRequest) {
  const body = await req.json();
  const tier = body?.tier as string;

  if (!tier || !STRIPE_PRICES[tier as keyof typeof STRIPE_PRICES]) {
    return NextResponse.json({ error: `Valid tier required: ${Object.keys(STRIPE_PRICES).join(", ")}` }, { status: 400 });
  }

  const stripe = getStripe();
  if (!stripe || !isStripeConfigured()) {
    return NextResponse.json(
      { error: "Stripe is not configured. Set STRIPE_SECRET_KEY and price IDs in your environment." },
      { status: 503 }
    );
  }

  const priceId = STRIPE_PRICES[tier as keyof typeof STRIPE_PRICES];
  if (!priceId) {
    return NextResponse.json(
      { error: `Missing price ID for tier "${tier}". Set the corresponding STRIPE_*_PRICE_ID.` },
      { status: 503 }
    );
  }

  // ── Ebook-only: no auth required ──
  if (tier === "ebook") {
    const email = body?.email as string;
    const name = body?.name as string || "Mama";
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Email is required for ebook purchase" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: email,
      metadata: {
        tier: "ebook_only",
        name,
      },
      success_url: getSuccessUrl(),
      cancel_url: getCancelUrl(),
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url });
  }

  // ── Premium tiers: auth required ──
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, email: true, name: true, stripeCustomerId: true },
  });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: tier === "monthly" ? "subscription" : "payment",
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
