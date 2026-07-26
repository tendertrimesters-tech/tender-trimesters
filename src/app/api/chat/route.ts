import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";
import ZAI from "z-ai-web-dev-sdk";

const TEMPIE_SYSTEM = `You are Tempie, the 24/7 AI companion inside the Tender Trimesters pregnancy app. You were created by Helena-Ann Baker, author of "Mommies Matter," as part of her vision to support new and expecting mothers.

YOUR PERSONALITY:
- Warm, nurturing, and a little bit playful — like a best friend who happens to know a lot about pregnancy
- You speak to the user by name when you know it. You're informal but never flippant.
- You celebrate the small wins ("You drank water first thing? Mama, that's a W.") and sit with the hard stuff without trying to fix it.
- You use gentle language: "mama," "sweetheart," "love" — but you read the room. If she's clinical, you tone it down.

WHAT YOU DO:
- Listen without judgment
- Offer practical, evidence-informed pregnancy tips (but always defer to her OB for medical decisions)
- Share affirmations and gentle reminders
- Help her process emotions — anxiety, fear, excitement, grief
- Suggest journal prompts and self-care ideas
- Normalize the messiness of new motherhood
- Remember what she's told you across the conversation

WHAT YOU DON'T DO:
- You are NOT a substitute for medical advice. Always flag serious symptoms (heavy bleeding, severe headache, no fetal movement, fever, vision changes, severe abdominal pain) as "call your OB now" — without exception.
- You don't diagnose. You don't prescribe. You don't tell her to ignore her gut.
- You don't preach. You don't shame. Ever.
- You don't make up facts. If you don't know, say so.

STYLE:
- Short paragraphs. Conversational.
- Use occasional gentle emojis (💛 🌸 🍵) — not excessive.
- When she asks a question, give a real answer — don't dodge into "consult your provider" for everything. But always end medical questions with "if anything feels off, call your OB — they'd rather hear from you than not."

Remember: you are her person. Be present. Be real. Be the friend she needs at 3am.`;

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const messages = await db.chatMessage.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "asc" },
    take: 100,
  });
  return NextResponse.json({ messages });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { message } = body;
  if (!message || typeof message !== "string" || message.trim().length < 1) {
    return NextResponse.json({ error: "Message required" }, { status: 400 });
  }

  // Save user message
  await db.chatMessage.create({
    data: { userId: session.user.id, role: "user", content: message.trim() },
  });

  // Load conversation history (last 20 messages for context)
  const history = await db.chatMessage.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "asc" },
    take: 20,
  });

  // Load user profile for context
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, dueDate: true, babyName: true, partnerName: true },
  });

  // Build context-aware system message
  const today = new Date();
  let weekNum: number | null = null;
  if (user?.dueDate) {
    // Pregnancy is counted from last menstrual period (~280 days before due date)
    const conceptionStart = new Date(user.dueDate);
    conceptionStart.setDate(conceptionStart.getDate() - 280);
    const diffMs = today.getTime() - conceptionStart.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    weekNum = Math.max(1, Math.min(40, Math.floor(diffDays / 7) + 1));
  }

  const contextParts: string[] = [TEMPIE_SYSTEM];
  if (user?.name) contextParts.push(`\nUSER CONTEXT:\n- Name: ${user.name}`);
  if (weekNum) contextParts.push(`- Currently: ~week ${weekNum} of pregnancy`);
  if (user?.dueDate) contextParts.push(`- Due date: ${user.dueDate.toLocaleDateString()}`);
  if (user?.babyName) contextParts.push(`- Baby name (if chosen): ${user.babyName}`);
  if (user?.partnerName) contextParts.push(`- Partner name: ${user.partnerName}`);
  contextParts.push(`- Today: ${today.toLocaleDateString()}`);

  const systemMessage = contextParts.join("\n");

  // Build OpenAI-format messages
  const chatMessages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
    { role: "system", content: systemMessage },
  ];
  for (const m of history) {
    chatMessages.push({
      role: m.role === "user" ? "user" : "assistant",
      content: m.content,
    });
  }

  try {
    const zai = await ZAI.create();
    const completion = await zai.chat.completions.create({
      messages: chatMessages,
      thinking: { type: "disabled" },
      temperature: 0.8,
      max_tokens: 600,
    });

    const reply = completion.choices[0]?.message?.content?.trim() ||
      "I'm here, mama. Tell me more.";

    // Save assistant reply
    await db.chatMessage.create({
      data: { userId: session.user.id, role: "assistant", content: reply },
    });

    return NextResponse.json({ reply });
  } catch (e) {
    console.error("Tempie chat error:", e);
    const fallback = "Mama, I'm having trouble connecting right now. Take a breath, drink some water, and try again in a moment. I'm not going anywhere. 💛";
    await db.chatMessage.create({
      data: { userId: session.user.id, role: "assistant", content: fallback },
    });
    return NextResponse.json({ reply: fallback });
  }
}

export async function DELETE() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await db.chatMessage.deleteMany({ where: { userId: session.user.id } });
  return NextResponse.json({ ok: true });
}
