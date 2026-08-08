import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const stories = await db.maternalStory.findMany({
    where: { userId: session.user.id },
    orderBy: { promptIndex: "asc" },
  });
  return NextResponse.json({ stories });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { promptIndex, response } = body;

  if (promptIndex === undefined || promptIndex === null || !response) {
    return NextResponse.json({ error: "promptIndex and response are required" }, { status: 400 });
  }

  const story = await db.maternalStory.create({
    data: {
      userId: session.user.id,
      promptIndex: Number(promptIndex),
      response: response.trim(),
    },
  });
  return NextResponse.json({ story });
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { id, response } = body;

  if (!id || !response) {
    return NextResponse.json({ error: "ID and response are required" }, { status: 400 });
  }

  const existing = await db.maternalStory.findUnique({ where: { id } });
  if (!existing || existing.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const updated = await db.maternalStory.update({
    where: { id },
    data: { response: response.trim() },
  });
  return NextResponse.json({ story: updated });
}
