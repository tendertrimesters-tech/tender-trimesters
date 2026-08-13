import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";

/**
 * DELETE /api/account/delete
 * Permanently deletes the user and ALL associated data.
 * GDPR/CCPA "right to be forgotten" compliance.
 *
 * Cascade deletes handle: journal, mood, appointments, bump photos,
 * chat messages, community posts/comments, meditation sessions,
 * ritual logs, maternal stories, fear entries, baby letters,
 * dream entries, name seeds, capsule items, playlist tracks.
 */
export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Delete the user — Prisma cascade handles all related records
    await db.user.delete({ where: { id: userId } });

    return NextResponse.json({
      message: "Your account and all associated data have been permanently deleted.",
    });
  } catch (error) {
    console.error("Account deletion failed:", error);
    return NextResponse.json(
      { error: "Failed to delete account. Please try again." },
      { status: 500 },
    );
  }
}
