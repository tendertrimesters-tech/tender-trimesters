import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";

// GET /api/meditation — return session history for the logged-in user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { isPremium: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch the user's meditation session history
    const sessions = await db.meditationSession.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json({
      sessions,
      isPremium: user.isPremium,
    });
  } catch (error) {
    console.error("GET /api/meditation error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// POST /api/meditation — log a completed (or partial) meditation session
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { isPremium: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Premium gate
    if (!user.isPremium) {
      return NextResponse.json(
        { error: "Premium feature", premiumRequired: true },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { meditationId, durationSec, completed } = body;

    if (!meditationId || typeof durationSec !== "number") {
      return NextResponse.json(
        { error: "meditationId and durationSec are required" },
        { status: 400 }
      );
    }

    const meditationSession = await db.meditationSession.create({
      data: {
        userId: session.user.id,
        meditationId,
        durationSec: Math.round(durationSec),
        completed: !!completed,
      },
    });

    return NextResponse.json(meditationSession);
  } catch (error) {
    console.error("POST /api/meditation error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
