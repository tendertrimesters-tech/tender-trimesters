import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";
import ZAI from "z-ai-web-dev-sdk";

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
  const { title, body: text, week } = body;

  if (!text || text.trim().length < 1) {
    return NextResponse.json({ error: "Dream body is required" }, { status: 400 });
  }

  // Create the entry first
  const entry = await db.dreamEntry.create({
    data: {
      userId: session.user.id,
      title: title?.trim() || null,
      body: text.trim(),
      week: week ? Number(week) : null,
    },
  });

  // Use AI to analyze the dream for symbols and themes
  try {
    const zai = await ZAI.create();
    const systemPrompt = `Analyze this pregnancy dream and extract recurring symbols and emotional themes. Dream: '${text.trim()}'. Return JSON: {"symbols": ["symbol1", "symbol2"], "themes": ["theme1", "theme2"]}. Keep to 3-5 symbols and 2-3 themes.`;

    const completion = await zai.chat.completions.create({
      messages: [{ role: "system", content: systemPrompt }],
      thinking: { type: "disabled" },
      temperature: 0.6,
    });

    const raw = completion.choices[0]?.message?.content?.trim() || "";
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      const symbols = Array.isArray(parsed.symbols) ? JSON.stringify(parsed.symbols) : null;
      const themes = Array.isArray(parsed.themes) ? JSON.stringify(parsed.themes) : null;

      const updated = await db.dreamEntry.update({
        where: { id: entry.id },
        data: { symbols, themes },
      });
      return NextResponse.json({ entry: updated });
    }
  } catch (e) {
    console.error("Dream analysis error:", e);
    // Return the entry without symbols/themes if analysis fails
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
