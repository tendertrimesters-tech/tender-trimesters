import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const appts = await db.appointment.findMany({
    where: { userId: session.user.id },
    orderBy: { date: "asc" },
    take: 50,
  });
  return NextResponse.json({ appointments: appts });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { title, date, location, notes, type } = body;

  if (!title || !date) {
    return NextResponse.json({ error: "Title and date required" }, { status: 400 });
  }

  const appt = await db.appointment.create({
    data: {
      userId: session.user.id,
      title: title.trim(),
      date: new Date(date),
      location: location?.trim() || null,
      notes: notes?.trim() || null,
      type: type || "other",
    },
  });
  return NextResponse.json({ appointment: appt });
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { id, completed } = body;
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  const existing = await db.appointment.findUnique({ where: { id } });
  if (!existing || existing.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const updated = await db.appointment.update({
    where: { id },
    data: { completed: !!completed },
  });
  return NextResponse.json({ appointment: updated });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  const existing = await db.appointment.findUnique({ where: { id } });
  if (!existing || existing.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await db.appointment.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
