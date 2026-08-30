// Resend email client (singleton).
// Sign up at https://resend.com, add your domain, and set RESEND_API_KEY in Vercel.

import { Resend } from "resend";

let _resend: Resend | null = null;
let _checked = false;

export function getEmailClient(): Resend | null {
  if (_checked) return _resend;
  _checked = true;
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.log("[email] RESEND_API_KEY not set — emails disabled");
    return null;
  }
  _resend = new Resend(key);
  return _resend;
}

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

// The "from" address. Must be a verified domain in your Resend dashboard.
// e.g. "Tender Trimesters <hello@tendertrimesters.com>"
export function getFromAddress(): string {
  return process.env.EMAIL_FROM || "Tender Trimesters <hello@tendertrimesters.com>";
}

export function getEbookUrl(): string {
  return process.env.EBOOK_URL || "https://www.amazon.com/dp/B0D7L7L2R4";
}
