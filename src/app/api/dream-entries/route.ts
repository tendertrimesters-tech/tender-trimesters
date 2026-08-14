import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";
import OpenAI from "openai";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const entries = await db.dreamEntry.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return NextResponse.json({ entries });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { title, body: text, week, mood } = body;

  if (!text || text.trim().length < 1) {
    return NextResponse.json({ error: "Dream body is required" }, { status: 400 });
  }

  // Create the entry first
  const entry = await db.dreamEntry.create({
    data: {
      userId: session.user.id,
      title: title?.trim() || null,
      body: text.trim(),
      mood: mood?.trim() || null,
      week: week ? Number(week) : null,
    },
  });

  // Use AI to analyze the dream for symbols, themes, and interpretation
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const moodContext = mood ? ` The dreamer felt ${mood} upon waking.` : "";
    const weekContext = week ? ` She is at week ${week} of pregnancy.` : "";
    const systemPrompt = `You are a dream interpreter who specializes in pregnancy dreams.${weekContext}${moodContext} Analyze this dream: '${text.trim()}'. Return JSON: {"symbols": ["symbol1", "symbol2", "symbol3"], "themes": ["theme1", "theme2"], "interpretation": "A warm 2-3 sentence interpretation connecting the dream to the mama's pregnancy journey. Be insightful and specific, not vague."}. Keep to 3-5 symbols and 2-3 themes. The interpretation should feel personal and meaningful.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: systemPrompt }],
      temperature: 0.7,
    });

    const raw = completion.choices[0]?.message?.content?.trim() || "";
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      const symbols = Array.isArray(parsed.symbols) ? JSON.stringify(parsed.symbols) : null;
      const themes = Array.isArray(parsed.themes) ? JSON.stringify(parsed.themes) : null;
      const interpretation = typeof parsed.interpretation === "string" ? parsed.interpretation : null;

      const updated = await db.dreamEntry.update({
        where: { id: entry.id },
        data: { symbols, themes, interpretation },
      });
      return NextResponse.json({ entry: updated });
    }
  } catch (e) {
    console.error("Dream analysis error:", e);
    // Return the entry without analysis if it fails
  }

  return NextResponse.json({ entry });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  const existing = await db.dreamEntry.findUnique({ where: { id } });
  if (!existing || existing.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await db.dreamEntry.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
