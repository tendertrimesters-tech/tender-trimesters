import { NextRequest, NextResponse } from "next/server";
import { getStripe, STRIPE_PRICES, isStripeConfigured } from "@/lib/stripe";

// POST /api/ebook-purchase
// Body: { email: string, name?: string }
// Creates a Stripe Checkout Session for the ebook (no auth required).
// After payment, the webhook sends an automated email with the ebook link.
export async function POST(req: NextRequest) {
  const body = await req.json();
  const email = body?.email as string;
  const name = body?.name as string || "Mama";

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "A valid email is required" }, { status: 400 });
  }

  const priceId = STRIPE_PRICES.ebook;
  if (!priceId) {
    return NextResponse.json(
      { error: "Ebook is not available for purchase yet. Check back soon!" },
      { status: 503 }
    );
  }

  const stripe = getStripe();
  if (!stripe || !isStripeConfigured()) {
    return NextResponse.json(
      { error: "Payment system is being set up. Check back soon!" },
      { status: 503 }
    );
  }

  const base = process.env.NEXTAUTH_URL || "https://tendertrimesters.com";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: priceId, quantity: 1 }],
    customer_email: email,
    metadata: {
      tier: "ebook_only",
      name,
    },
    success_url: `${base}/?ebook=success`,
    cancel_url: `${base}/#bundle`,
    allow_promotion_codes: true,
  });

  return NextResponse.json({ url: session.url });
}
