import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { addMailchimpSubscriber, isMailchimpConfigured } from "@/lib/mailchimp";
import { getEmailClient, isEmailConfigured, getFromAddress } from "@/lib/email";
import { waitlistWelcomeEmail, waitlistWelcomeEmailText } from "@/lib/waitlist-email";

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

    // 2. Add to Mailchimp (for audience storage and future campaigns)
    // Runs in background — if it fails, the waitlist still succeeded
    if (isMailchimpConfigured()) {
      addMailchimpSubscriber(email, name, source).catch((err) => {
        console.error("[waitlist] Mailchimp sync failed (non-blocking):", err);
      });
    }

    // 3. Send welcome email via Resend
    // Runs in background — if it fails, the waitlist still succeeded
    if (isEmailConfigured()) {
      const resend = getEmailClient();
      if (resend) {
        resend.emails.send({
          from: getFromAddress(),
          to: email.toLowerCase().trim(),
          subject: "Welcome to Tender Trimesters, mama 💛",
          html: waitlistWelcomeEmail(name?.trim() || null),
          text: waitlistWelcomeEmailText(name?.trim() || null),
          tags: [{ name: "waitlist", value: source || "landing" }],
        }).then((result) => {
          console.log("[waitlist] Welcome email sent:", result?.data?.id || "unknown");
        }).catch((err) => {
          console.error("[waitlist] Welcome email failed (non-blocking):", err);
        });
      }
    } else {
      console.log("[waitlist] Resend not configured — skipping welcome email");
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
