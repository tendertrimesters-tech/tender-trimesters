import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { addMailchimpSubscriber, isMailchimpConfigured } from "@/lib/mailchimp";

export async function POST(req: NextRequest) {
  try {
    const { email, name, source } = await req.json();
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    // 1. Save to database (always — this is our source of truth)
    const entry = await db.waitlistEntry.upsert({
      where: { email: email.toLowerCase().trim() },
      create: {
        email: email.toLowerCase().trim(),
        name: name?.trim() || null,
        source: source || "landing",
      },
      update: {}, // don't overwrite if already exists
    });

    // 2. Add to Mailchimp (for automated email sequences)
    // This runs in the background — if it fails, the waitlist still succeeded
    if (isMailchimpConfigured()) {
      addMailchimpSubscriber(email, name, source).catch((err) => {
        console.error("[waitlist] Mailchimp sync failed (non-blocking):", err);
      });
    } else {
      console.log("[waitlist] Mailchimp not configured — skipping sync");
    }

    return NextResponse.json({ ok: true, id: entry.id });
  } catch (e) {
    console.error("waitlist error", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  // Return count of waitlist entries (for admin/stats)
  try {
    const count = await db.waitlistEntry.count();
    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}
