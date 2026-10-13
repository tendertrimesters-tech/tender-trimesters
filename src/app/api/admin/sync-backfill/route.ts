// TEMPORARY: One-time backfill of existing DB waitlist entries to Mailchimp + Resend.
// DELETE THIS FILE after running.
//
// Usage:
//   1. Deploy this commit to Vercel
//   2. Open in browser: https://tendertrimesters.com/api/admin/sync-backfill?token=tt-backfill-2026-10-13-7f3a9c2e5b1d8m4
//   3. Wait for JSON response with sync results
//   4. Delete this file and commit the deletion

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db";
import { addMailchimpSubscriber, isMailchimpConfigured } from "@/lib/mailchimp";
import { getEmailClient, isEmailConfigured, getFromAddress } from "@/lib/email";
import { waitlistWelcomeEmail, waitlistWelcomeEmailText } from "@/lib/waitlist-email";

const ADMIN_TOKEN = "tt-backfill-2026-10-13-7f3a9c2e5b1d8m4";

const SKIP_EMAILS = [
  "shalikhabaker1985@gmail.com",
];

const TEST_PATTERNS = [
  /@tendertrimesters\.com$/i,
  /@example\.(com|org)$/i,
  /^test@/i,
  /^dev@/i,
  /\+test@/i,
  /@mailinator\.com$/i,
];

function isTestEmail(email: string): boolean {
  return TEST_PATTERNS.some((p) => p.test(email));
}

export async function GET(req: NextRequest) {
  // Token check
  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  if (token !== ADMIN_TOKEN) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const results: Array<{
    email: string;
    mailchimp: "synced" | "skipped" | "failed";
    email_sent: "sent" | "skipped" | "failed";
    error?: string;
  }> = [];

  try {
    const allEntries = await db.waitlistEntry.findMany({
      orderBy: { createdAt: "asc" },
    });

    const skipSet = new Set(SKIP_EMAILS.map((e) => e.toLowerCase().trim()));
    const toProcess = allEntries.filter(
      (e) => !skipSet.has(e.email.toLowerCase().trim()) && !isTestEmail(e.email)
    );

    let mailchimpSynced = 0;
    let mailchimpFailed = 0;
    let emailsSent = 0;
    let emailFailed = 0;
    let skipped = 0;

    for (const entry of allEntries) {
      const emailLower = entry.email.toLowerCase().trim();

      if (skipSet.has(emailLower) || isTestEmail(entry.email)) {
        skipped++;
        results.push({
          email: entry.email,
          mailchimp: "skipped",
          email_sent: "skipped",
        });
        continue;
      }

      // 1. Sync to Mailchimp (PUT, idempotent)
      let mcStatus: "synced" | "failed" = "failed";
      let mcError: string | undefined;
      if (isMailchimpConfigured()) {
        try {
          const ok = await addMailchimpSubscriber(entry.email, entry.name, entry.source);
          mcStatus = ok ? "synced" : "failed";
          if (!ok) {
            mcError = "addMailchimpSubscriber returned false (check API key/audience)";
          }
        } catch (err) {
          mcStatus = "failed";
          mcError = err instanceof Error ? err.message : String(err);
        }
      } else {
        mcStatus = "failed";
        mcError = "Mailchimp not configured";
      }
      if (mcStatus === "synced") mailchimpSynced++;
      else mailchimpFailed++;

      // 2. Send welcome email via Resend
      let emailStatus: "sent" | "failed" = "failed";
      let emailError: string | undefined;
      if (isEmailConfigured()) {
        const resend = getEmailClient();
        if (resend) {
          try {
            const result = await resend.emails.send({
              from: getFromAddress(),
              to: emailLower,
              subject: "Welcome to Tender Trimesters, mama 💛",
              html: waitlistWelcomeEmail(entry.name?.trim() || null),
              text: waitlistWelcomeEmailText(entry.name?.trim() || null),
              tags: [{ name: "waitlist", value: entry.source || "landing" }],
            });
            if (result?.data?.id) {
              emailStatus = "sent";
            } else {
              emailError = "Resend returned no email ID";
            }
          } catch (err) {
            emailError = err instanceof Error ? err.message : String(err);
          }
        } else {
          emailError = "Resend client null";
        }
      } else {
        emailError = "Resend not configured";
      }
      if (emailStatus === "sent") emailsSent++;
      else emailFailed++;

      results.push({
        email: entry.email,
        mailchimp: mcStatus,
        email_sent: emailStatus,
        error: mcError || emailError,
      });

      // Pace: 500ms delay between contacts (Resend rate limit safety)
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    return NextResponse.json({
      summary: {
        total_db_entries: allEntries.length,
        processed: toProcess.length,
        skipped,
        mailchimp_synced: mailchimpSynced,
        mailchimp_failed: mailchimpFailed,
        emails_sent: emailsSent,
        email_failed: emailFailed,
      },
      results,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: "Script error", details: msg }, { status: 500 });
  }
}
