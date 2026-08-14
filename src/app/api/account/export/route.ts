import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";

/**
 * GET /api/account/export
 * Returns all user data as a JSON download — GDPR/CCPA compliance.
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    // Fetch every piece of user data in parallel
    const [
      user,
      journalEntries,
      moodEntries,
      appointments,
      bumpPhotos,
      chatMessages,
      communityPosts,
      communityComments,
      meditationSessions,
      ritualLogs,
      maternalStories,
      fearEntries,
      babyLetters,
      dreamEntries,
      nameSeeds,
      capsuleItems,
      playlistTracks,
    ] = await Promise.all([
      db.user.findUniqueOrThrow({
        where: { id: userId },
        select: {
          email: true, name: true, dueDate: true, babyName: true,
          partnerName: true, isPremium: true, premiumTier: true,
          premiumSince: true, createdAt: true, updatedAt: true,
          // Explicitly exclude passwordHash
        },
      }),
      db.journalEntry.findMany({ where: { userId }, orderBy: { createdAt: "desc" } }),
      db.moodEntry.findMany({ where: { userId }, orderBy: { createdAt: "desc" } }),
      db.appointment.findMany({ where: { userId }, orderBy: { date: "desc" } }),
      db.bumpPhoto.findMany({ where: { userId }, orderBy: { createdAt: "desc" } }),
      db.chatMessage.findMany({ where: { userId }, orderBy: { createdAt: "desc" } }),
      db.communityPost.findMany({
        where: { userId },
        include: { comments: true },
        orderBy: { createdAt: "desc" },
      }),
      db.communityComment.findMany({ where: { userId }, orderBy: { createdAt: "desc" } }),
      db.meditationSession.findMany({ where: { userId }, orderBy: { createdAt: "desc" } }),
      db.ritualLog.findMany({ where: { userId }, orderBy: { createdAt: "desc" } }),
      db.maternalStory.findMany({ where: { userId }, orderBy: { createdAt: "desc" } }),
      db.fearEntry.findMany({ where: { userId }, orderBy: { createdAt: "desc" } }),
      db.babyLetter.findMany({ where: { userId }, orderBy: { week: "asc" } }),
      db.dreamEntry.findMany({ where: { userId }, orderBy: { createdAt: "desc" } }),
      db.nameSeed.findMany({ where: { userId }, orderBy: { createdAt: "desc" } }),
      db.capsuleItem.findMany({ where: { userId }, orderBy: { createdAt: "desc" } }),
      db.playlistTrack.findMany({ where: { userId }, orderBy: { createdAt: "desc" } }),
    ]);

    const exportData = {
      exportedAt: new Date().toISOString(),
      app: "Tender Trimesters by Mommies Matter",
      profile: user,
      journalEntries,
      moodEntries,
      appointments,
      bumpPhotos,
      chatMessages,
      communityPosts,
      communityComments,
      meditationSessions,
      ritualLogs,
      maternalStories,
      fearEntries,
      babyLetters,
      dreamEntries,
      nameSeeds,
      capsuleItems,
      playlistTracks,
    };

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition":
          `attachment; filename="tender-trimesters-export-${new Date().toISOString().slice(0, 10)}.json"`,
      },
    });
  } catch (error) {
    console.error("Account export failed:", error);
    return NextResponse.json(
      { error: "Failed to export data. Please try again." },
      { status: 500 },
    );
  }
}
