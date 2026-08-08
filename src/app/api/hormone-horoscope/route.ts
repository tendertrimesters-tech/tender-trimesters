import { NextRequest, NextResponse } from "next/server";
import { getHormoneInsight } from "@/data/signature-features";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const weekParam = searchParams.get("week");

  if (!weekParam) {
    return NextResponse.json({ error: "Week parameter is required" }, { status: 400 });
  }

  const week = Number(weekParam);
  if (isNaN(week) || week < 1 || week > 40) {
    return NextResponse.json({ error: "Week must be a number between 1 and 40" }, { status: 400 });
  }

  const insight = getHormoneInsight(week);

  if (!insight) {
    return NextResponse.json({ error: "No insight found for this week" }, { status: 404 });
  }

  return NextResponse.json({ week, ...insight });
}
