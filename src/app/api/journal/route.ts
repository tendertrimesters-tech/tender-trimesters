import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const entries = await db.journalEntry.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  return NextResponse.json({ entries });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { week, title, body: text, mood, craving, babyName, photoUrl } = body;

  if (!text || text.trim().length < 1) {
    return NextResponse.json({ error: "Entry body required" }, { status: 400 });
  }

  const entry = await db.journalEntry.create({
    data: {
      userId: session.user.id,
      week: week ? Number(week) : null,
      title: title?.trim() || null,
      body: text.trim(),
      mood: mood || null,
      craving: craving?.trim() || null,
      babyName: babyName?.trim() || null,
      photoUrl: photoUrl || null,
    },
  });
  return NextResponse.json({ entry });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  // Verify ownership
  const existing = await db.journalEntry.findUnique({ where: { id } });
  if (!existing || existing.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await db.journalEntry.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
