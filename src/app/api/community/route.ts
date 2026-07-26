import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";

export async function GET() {
  const posts = await db.communityPost.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      user: { select: { name: true } },
      comments: {
        orderBy: { createdAt: "asc" },
        include: { user: { select: { name: true } } },
      },
    },
  });
  // Filter out the system welcome post from being linked to a real user
  return NextResponse.json({ posts });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { body: text, mood, week } = body;

  if (!text || text.trim().length < 1) {
    return NextResponse.json({ error: "Post body required" }, { status: 400 });
  }
  if (text.length > 2000) {
    return NextResponse.json({ error: "Post too long (max 2000 chars)" }, { status: 400 });
  }

  const post = await db.communityPost.create({
    data: {
      userId: session.user.id,
      body: text.trim(),
      mood: mood || null,
      week: week ? Number(week) : null,
    },
    include: { user: { select: { name: true } } },
  });
  return NextResponse.json({ post });
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { id, action } = body; // action: "hug" | "comment"
  if (!id || !action) return NextResponse.json({ error: "Missing params" }, { status: 400 });

  if (action === "hug") {
    const updated = await db.communityPost.update({
      where: { id },
      data: { hugs: { increment: 1 } },
    });
    return NextResponse.json({ post: updated });
  }

  if (action === "comment") {
    const { comment } = body;
    if (!comment || comment.trim().length < 1) {
      return NextResponse.json({ error: "Comment required" }, { status: 400 });
    }
    const c = await db.communityComment.create({
      data: {
        postId: id,
        userId: session.user.id,
        body: comment.trim(),
      },
      include: { user: { select: { name: true } } },
    });
    return NextResponse.json({ comment: c });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
