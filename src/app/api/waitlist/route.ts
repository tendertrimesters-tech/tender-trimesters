import { NextRequest, NextResponse } from "next/server";
import { after } from "next/server";
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
      update: {},
    });

    // 2. Side effects (Mailchimp sync + Resend welcome email).
    // CRITICAL: Must use `after()` from next/server, NOT fire-and-forget `.then()`.
    // Vercel freezes the serverless function the moment it returns a response —
    // any pending promises that haven't fired yet never run. `after()` tells
    // Vercel to keep the function alive until this work completes, without
    // making the user wait for the response (they get 200 OK instantly).
    after(async () => {
      // Mailchimp sync (PUT is idempotent — safe to retry)
      if (isMailchimpConfigured()) {
        try {
          const ok = await addMailchimpSubscriber(email, name, source);
          if (ok) {
            console.log("[waitlist] Mailchimp sync: SUCCESS");
          } else {
            console.error("[waitlist] Mailchimp sync: FAILED (returned false — check API key, audience ID, and permissions)");
          }
        } catch (err) {
          console.error("[waitlist] Mailchimp sync: ERROR", err?.message || err);
        }
      } else {
        console.warn("[waitlist] Mailchimp not configured — skipping sync. Set MAILCHIMP_API_KEY and MAILCHIMP_AUDIENCE_ID in Vercel.");
      }

      // Resend welcome email
      if (isEmailConfigured()) {
        const resend = getEmailClient();
        if (resend) {
          try {
            const result = await resend.emails.send({
              from: getFromAddress(),
              to: email.toLowerCase().trim(),
              subject: "Welcome to Tender Trimesters, mama 💛",
              html: waitlistWelcomeEmail(name?.trim() || null),
              text: waitlistWelcomeEmailText(name?.trim() || null),
              tags: [{ name: "waitlist", value: source || "landing" }],
            });
            if (result?.data?.id) {
              console.log("[waitlist] Welcome email sent: SUCCESS (id:", result.data.id + ")");
            } else {
              console.error("[waitlist] Welcome email: FAILED — no ID returned", JSON.stringify(result));
            }
          } catch (err) {
            console.error("[waitlist] Welcome email: ERROR", err?.message || err);
          }
        }
      } else {
        console.warn("[waitlist] Resend not configured — skipping welcome email. Set RESEND_API_KEY in Vercel.");
      }
    });

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
