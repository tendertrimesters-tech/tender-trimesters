import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const week = searchParams.get("week");

  if (week) {
    const w = await db.weeklyContent.findUnique({ where: { week: Number(week) } });
    if (!w) return NextResponse.json({ error: "Week not found" }, { status: 404 });
    return NextResponse.json({ week: w });
  }

  const weeks = await db.weeklyContent.findMany({
    orderBy: { week: "asc" },
  });
  return NextResponse.json({ weeks });
}
