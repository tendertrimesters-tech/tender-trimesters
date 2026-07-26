import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";

// Mock premium activation (in production, this would be called after Stripe webhook confirms payment)
export async function POST(req: NextRequest) {
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
