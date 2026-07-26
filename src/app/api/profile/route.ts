import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      email: true,
      name: true,
      dueDate: true,
      babyName: true,
      partnerName: true,
      isPremium: true,
      premiumTier: true,
      premiumSince: true,
      onboarded: true,
      partnerLinkToken: true,
      createdAt: true,
    },
  });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ user });
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const allowed: Array<keyof typeof db.user.fields> = [
    "name",
    "dueDate",
    "babyName",
    "partnerName",
    "onboarded",
    "partnerLinkToken",
  ];

  const data: Record<string, unknown> = {};
  for (const key of Object.keys(body)) {
    if (allowed.includes(key as never)) {
      data[key] = body[key];
    }
  }

  // Convert dueDate string to Date if provided
  if (typeof data.dueDate === "string") {
    data.dueDate = new Date(data.dueDate);
  }

  // Generate partner link token if requested
  if (data.partnerLinkToken === "generate") {
    data.partnerLinkToken = `pt_${Math.random().toString(36).slice(2, 12)}${Date.now().toString(36)}`;
  }

  const updated = await db.user.update({
    where: { id: session.user.id },
    data,
    select: {
      id: true, email: true, name: true, dueDate: true, babyName: true, partnerName: true,
      isPremium: true, premiumTier: true, premiumSince: true, onboarded: true, partnerLinkToken: true,
    },
  });
  return NextResponse.json({ user: updated });
}
