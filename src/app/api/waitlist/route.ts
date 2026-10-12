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

    const entry = await db.waitlistEntry.upsert({
      where: { email: email.toLowerCase().trim() },
      create: {
        email: email.toLowerCase().trim(),
        name: name?.trim() || null,
        source: source || "landing",
      },
      update: {},
    });

    if (isMailchimpConfigured()) {
      addMailchimpSubscriber(email, name, source).then((success) => {
        if (success) {
          console.log("[waitlist] Mailchimp sync: SUCCESS");
        } else {
          console.error("[waitlist] Mailchimp sync: FAILED — check API key, audience ID, and permissions");
        }
      }).catch((err) => {
        console.error("[waitlist] Mailchimp sync: ERROR", err?.message || err);
      });
    } else {
      console.warn("[waitlist] Mailchimp not configured — skipping sync");
    }

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
          if (result?.data?.id) {
            console.log("[waitlist] Welcome email sent: SUCCESS");
          } else {
            console.error("[waitlist] Welcome email: FAILED — no ID returned");
          }
        }).catch((err) => {
          console.error("[waitlist] Welcome email: ERROR", err?.message || err);
        });
      }
    } else {
      console.warn("[waitlist] Resend not configured — skipping welcome email");
    }

    return NextResponse.json({ ok: true, id: entry.id });
  } catch (e) {
    console.error("waitlist error", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const count = await db.waitlistEntry.count();
    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}
