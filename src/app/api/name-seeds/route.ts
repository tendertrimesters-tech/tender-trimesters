import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const seeds = await db.nameSeed.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ seeds });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { name, feeling, week } = body;

  if (!name || name.trim().length < 1) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const seed = await db.nameSeed.create({
    data: {
      userId: session.user.id,
      name: name.trim(),
      feeling: feeling?.trim() || null,
      week: week ? Number(week) : null,
    },
  });
  return NextResponse.json({ seed });
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { id, name, feeling, chosen } = body;

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  const existing = await db.nameSeed.findUnique({ where: { id } });
  if (!existing || existing.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // If choosing this name, deselect all others for this user
  if (chosen === true) {
    await db.nameSeed.updateMany({
      where: { userId: session.user.id, id: { not: id } },
      data: { chosen: false },
    });
  }

  const updated = await db.nameSeed.update({
    where: { id },
    data: {
      ...(name !== undefined && { name: name.trim() }),
      ...(feeling !== undefined && { feeling: feeling.trim() || null }),
      ...(chosen !== undefined && { chosen }),
    },
  });
  return NextResponse.json({ seed: updated });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  const existing = await db.nameSeed.findUnique({ where: { id } });
  if (!existing || existing.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await db.nameSeed.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
