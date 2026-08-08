import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// Public endpoint — partner views mama's journey via link token (read-only)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  if (!token) return NextResponse.json({ error: "Token required" }, { status: 400 });

  const mama = await db.user.findUnique({
    where: { partnerLinkToken: token },
    select: {
      name: true,
      dueDate: true,
      babyName: true,
      partnerName: true,
    },
  });
  if (!mama) return NextResponse.json({ error: "Invalid link" }, { status: 404 });

  // Calculate current week
  let week: number | null = null;
  if (mama.dueDate) {
    const conceptionStart = new Date(mama.dueDate);
    conceptionStart.setDate(conceptionStart.getDate() - 280);
    const diffDays = Math.floor((Date.now() - conceptionStart.getTime()) / (1000 * 60 * 60 * 24));
    week = Math.max(1, Math.min(40, Math.floor(diffDays / 7) + 1));
  }

  // Fetch this week's content (read-only)
  let weeklyContent: any = null;
  if (week) {
    weeklyContent = await db.weeklyContent.findUnique({ where: { week } });
  }

  // Fetch upcoming appointments (read-only)
  const upcomingAppts = await db.appointment.findMany({
    where: {
      user: { partnerLinkToken: token },
      date: { gte: new Date() },
      completed: false,
    },
    orderBy: { date: "asc" },
    take: 5,
  });

  return NextResponse.json({
    mama: {
      name: mama.name,
      dueDate: mama.dueDate,
      babyName: mama.babyName,
      partnerName: mama.partnerName,
      week,
    },
    weeklyContent,
    upcomingAppts,
  });
}
