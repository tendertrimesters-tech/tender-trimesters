import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { isStripeConfigured } from "@/lib/stripe";
import { db } from "@/lib/db";

// POST /api/premium
// DEV-ONLY mock premium activation. Used while Stripe is not yet configured
// so you can test the full premium UX without charging a real card.
//
// In production (when STRIPE_SECRET_KEY is set), this route refuses to run
// and the client must use /api/stripe/checkout instead.

export async function POST(req: NextRequest) {
  if (isStripeConfigured()) {
    return NextResponse.json(
      { error: "Stripe is configured. Use /api/stripe/checkout to process real payments." },
      { status: 409 }
    );
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { tier } = body; // "one_time" | "monthly"
  if (!tier || !["one_time", "monthly"].includes(tier)) {
    return NextResponse.json({ error: "Valid tier required" }, { status: 400 });
  }

  const updated = await db.user.update({
    where: { id: session.user.id },
    data: {
      isPremium: true,
      premiumTier: tier,
      premiumSince: new Date(),
    },
    select: { id: true, isPremium: true, premiumTier: true, premiumSince: true },
  });
  return NextResponse.json({ user: updated });
}
