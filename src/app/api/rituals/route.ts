import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rituals = await db.ritualLog.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return NextResponse.json({ rituals });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { week, phrase, gesture, breath } = body;

  if (!week || !phrase || !gesture || !breath) {
    return NextResponse.json({ error: "Week, phrase, gesture, and breath are required" }, { status: 400 });
  }

  const ritual = await db.ritualLog.create({
    data: {
      userId: session.user.id,
      week: Number(week),
      phrase: phrase.trim(),
      gesture: gesture.trim(),
      breath: breath.trim(),
      completed: true,
    },
  });
  return NextResponse.json({ ritual });
}
