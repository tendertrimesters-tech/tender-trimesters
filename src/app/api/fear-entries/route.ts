import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";
import OpenAI from "openai";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const entries = await db.fearEntry.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ entries });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { fear, week, category } = body;

  if (!fear || fear.trim().length < 1) {
    return NextResponse.json({ error: "Fear description is required" }, { status: 400 });
  }

  const entry = await db.fearEntry.create({
    data: {
      userId: session.user.id,
      fear: fear.trim(),
      week: week ? Number(week) : null,
      category: category?.trim() || null,
      stage: "ember",
    },
  });
  return NextResponse.json({ entry });
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { id, action } = body;

  if (!id || !action) {
    return NextResponse.json({ error: "ID and action are required" }, { status: 400 });
  }

  const existing = await db.fearEntry.findUnique({ where: { id } });
  if (!existing || existing.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Delete mode
  if (action === "delete") {
    await db.fearEntry.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  }

  // Flame mode — user marks as fully transformed
  if (action === "flame") {
    const updated = await db.fearEntry.update({
      where: { id },
      data: { stage: "flame" },
    });
    return NextResponse.json({ entry: updated });
  }

  // Reframe mode — AI generates a gentle reframe and grounding action
  if (action === "reframe") {
    try {
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const categoryContext = existing.category ? ` This fear is about ${existing.category}.` : "";
      const weekContext = existing.week ? ` She is at week ${existing.week} of pregnancy.` : "";
      const systemPrompt = `You are a warm, wise pregnancy companion.${weekContext} A pregnant mama has shared a fear: '${existing.fear}'.${categoryContext} Gently reframe it into courage (2-3 sentences of warmth and truth). Then suggest one small grounding action (1 sentence). Return JSON like: {"reframed": "...", "action": "..."}. Be specific, not generic.`;
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "system", content: systemPrompt }],
        temperature: 0.8,
      });

      const raw = completion.choices[0]?.message?.content?.trim() || "";
      // Extract JSON from the response (handle possible markdown wrapping)
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        return NextResponse.json({ error: "AI failed to generate a valid reframe" }, { status: 500 });
      }

      const parsed = JSON.parse(jsonMatch[0]);
      const updated = await db.fearEntry.update({
        where: { id },
        data: {
          reframed: parsed.reframed || null,
          action: parsed.action || null,
          stage: "spark",
        },
      });
      return NextResponse.json({ entry: updated });
    } catch (e) {
      console.error("Fear reframe error:", e);
      return NextResponse.json({ error: "Failed to generate reframe" }, { status: 500 });
    }
  }

  return NextResponse.json({ error: "Invalid action. Use 'reframe', 'flame', or 'delete'." }, { status: 400 });
}
