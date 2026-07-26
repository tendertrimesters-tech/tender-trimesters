import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const photos = await db.bumpPhoto.findMany({
    where: { userId: session.user.id },
    orderBy: { week: "asc" },
  });
  return NextResponse.json({ photos });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Premium-gated feature
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { isPremium: true },
  });
  if (!user?.isPremium) {
    return NextResponse.json({ error: "Premium feature", premiumRequired: true }, { status: 403 });
  }

  const body = await req.json();
  const { week, photoUrl, caption } = body;
  if (!week || !photoUrl) {
    return NextResponse.json({ error: "Week and photo required" }, { status: 400 });
  }

  const photo = await db.bumpPhoto.create({
    data: {
      userId: session.user.id,
      week: Number(week),
      photoUrl,
      caption: caption?.trim() || null,
    },
  });
  return NextResponse.json({ photo });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  const existing = await db.bumpPhoto.findUnique({ where: { id } });
  if (!existing || existing.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await db.bumpPhoto.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
