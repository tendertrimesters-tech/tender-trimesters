import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";
import OpenAI from "openai";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const letters = await db.babyLetter.findMany({
    where: { userId: session.user.id },
    orderBy: { week: "asc" },
  });
  return NextResponse.json({ letters });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { week, babyName } = body;

  if (!week) {
    return NextResponse.json({ error: "Week is required" }, { status: 400 });
  }

  const weekNum = Number(week);

  // Prevent duplicate letter for the same week
  const existing = await db.babyLetter.findFirst({
    where: { userId: session.user.id, week: weekNum },
  });
  if (existing) {
    return NextResponse.json({ error: "Letter for this week already exists", letter: existing }, { status: 409 });
  }

  // Fetch weekly content for context
  const weeklyContent = await db.weeklyContent.findUnique({ where: { week: weekNum } });

  const babySize = weeklyContent?.babySize || "a tiny growing miracle";
  const babySizeDesc = weeklyContent?.babySizeDesc || "growing beautifully inside you";
  const bodyChanges = weeklyContent?.bodyChanges || "beautiful changes happening";
  const emotionalChanges = weeklyContent?.emotionalChanges || "a mix of feelings";

  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const name = babyName || "Mama";
    const systemPrompt = `You are a baby writing a tender letter to their mama from inside the womb. The mama is at week ${weekNum} of pregnancy. The mama calls you ${name}. Baby development context: ${babySize} - ${babySizeDesc}. Body changes mama is experiencing: ${bodyChanges}. Emotional changes: ${emotionalChanges}. Write a short, deeply loving letter (150-200 words) in the baby's voice. Use the name "${name}" naturally. Be specific about what they're experiencing this week — what they can see, hear, feel. Reference the mama's experiences with empathy. End with something that makes the mama feel deeply loved. Don't be cutesy or baby-talk. Be poetic and real.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: systemPrompt }],
      temperature: 0.85,
      max_tokens: 400,
    });

    const letter = completion.choices[0]?.message?.content?.trim() || "Mama, I'm here with you, growing and waiting for you.";

    // Save the letter to the database
    const saved = await db.babyLetter.create({
      data: {
        userId: session.user.id,
        week: weekNum,
        letter,
      },
    });

    return NextResponse.json({ letter: saved });
  } catch (e) {
    console.error("Baby letter generation error:", e);
    return NextResponse.json({ error: "Failed to generate baby letter" }, { status: 500 });
  }
}
