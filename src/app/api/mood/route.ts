import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const entries = await db.moodEntry.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 200,
  });
  return NextResponse.json({ entries });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { mood, note, week } = body;

  const validMoods = ["glowing", "calm", "tired", "anxious", "teary", "grateful", "nauseous", "energized"];
  if (!mood || !validMoods.includes(mood)) {
    return NextResponse.json({ error: "Valid mood required" }, { status: 400 });
  }

  // One mood per day — replace if exists for today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const existing = await db.moodEntry.findFirst({
    where: {
      userId: session.user.id,
      createdAt: { gte: today, lt: tomorrow },
    },
  });

  let entry;
  if (existing) {
    entry = await db.moodEntry.update({
      where: { id: existing.id },
      data: {
        mood,
        note: note?.trim() || null,
        week: week ? Number(week) : existing.week,
      },
    });
  } else {
    entry = await db.moodEntry.create({
      data: {
        userId: session.user.id,
        mood,
        note: note?.trim() || null,
        week: week ? Number(week) : null,
      },
    });
  }

  return NextResponse.json({ entry });
}
