import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const unlockedParam = searchParams.get("unlocked");
  const typeParam = searchParams.get("type");

  const where: Record<string, unknown> = { userId: session.user.id };
  if (unlockedParam === "true") {
    where.unlocked = true;
  }
  if (typeParam) {
    where.type = typeParam;
  }

  const items = await db.capsuleItem.findMany({
    where,
    orderBy: [
      { unlockDate: { sort: "asc", nulls: "last" } },
      { createdAt: "desc" },
    ],
  });
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { type, title, body: text, unlockDate } = body;

  if (!type || !title || title.trim().length < 1) {
    return NextResponse.json({ error: "Type and title are required" }, { status: 400 });
  }

  const item = await db.capsuleItem.create({
    data: {
      userId: session.user.id,
      type: type.trim(),
      title: title.trim(),
      body: text?.trim() || null,
      ...(unlockDate && { unlockDate: new Date(unlockDate) }),
    },
  });
  return NextResponse.json({ item });
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { id, unlockDate, action } = body;

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  const existing = await db.capsuleItem.findUnique({ where: { id } });
  if (!existing || existing.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const data: Record<string, unknown> = {};
  if (unlockDate !== undefined) {
    data.unlockDate = unlockDate ? new Date(unlockDate) : null;
  }

  // If action is "unlock" and the unlock date has passed, mark as unlocked
  if (action === "unlock" && existing.unlockDate && new Date() >= existing.unlockDate) {
    data.unlocked = true;
  }

  const updated = await db.capsuleItem.update({
    where: { id },
    data,
  });
  return NextResponse.json({ item: updated });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  const existing = await db.capsuleItem.findUnique({ where: { id } });
  if (!existing || existing.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await db.capsuleItem.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
