import crypto from "crypto";

// Mailchimp client for adding waitlist subscribers.
// Uses the Marketing API to add/update members in a specific audience.
//
// Required env vars (set in Vercel → Settings → Environment Variables):
//   MAILCHIMP_API_KEY     — from Mailchimp → Account → Extras → API keys
//   MAILCHIMP_AUDIENCE_ID — from Mailchimp → Audience → Settings → Audience name and defaults

interface MailchimpMember {
  email_address: string;
  status: "subscribed" | "pending" | "unsubscribed";
  merge_fields?: {
    FNAME?: string;
    LNAME?: string;
  };
  tags?: string[];
}

interface MailchimpResponse {
  id: string;
  email_address: string;
  status: string;
}

function getServerPrefix(): string | null {
  const key = process.env.MAILCHIMP_API_KEY;
  if (!key) return null;
  const parts = key.split("-");
  return parts.length > 1 ? parts[parts.length - 1] : null;
}

export function isMailchimpConfigured(): boolean {
  return Boolean(
    process.env.MAILCHIMP_API_KEY && process.env.MAILCHIMP_AUDIENCE_ID
  );
}

export async function addMailchimpSubscriber(
  email: string,
  name?: string | null,
  source?: string | null
): Promise<boolean> {
  const apiKey = process.env.MAILCHIMP_API_KEY;
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;
  const serverPrefix = getServerPrefix();

  if (!apiKey || !audienceId || !serverPrefix) {
    console.log("[mailchimp] Not configured — skipping. Set MAILCHIMP_API_KEY and MAILCHIMP_AUDIENCE_ID in Vercel.");
    return false;
  }

  let mergeFields: MailchimpMember["merge_fields"] = {};
  if (name) {
    const nameParts = name.trim().split(/\s+/);
    mergeFields.FNAME = nameParts[0];
    if (nameParts.length > 1) {
      mergeFields.LNAME = nameParts.slice(1).join(" ");
    }
  }

  const memberData: MailchimpMember = {
    email_address: email.toLowerCase().trim(),
    status: "subscribed",
    merge_fields: mergeFields,
    tags: source ? [source] : ["waitlist"],
  };

  try {
    const authHeader = Buffer.from(`anystring:${apiKey}`).toString("base64");
    const subscriberHash = crypto.createHash("md5").update(email.toLowerCase().trim()).digest("hex");
    const url = `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${audienceId}/members/${subscriberHash}`;

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${authHeader}`,
      },
      body: JSON.stringify(memberData),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`[mailchimp] API error ${response.status}: ${errorBody}`);
      return false;
    }

    const data = (await response.json()) as MailchimpResponse;
    console.log(`[mailchimp] SUCCESS: Added/updated subscriber (status: ${data.status})`);
    return true;
  } catch (error) {
    console.error("[mailchimp] Failed to add subscriber:", error);
    return false;
  }
}

export async function tagMailchimpSubscriber(
  email: string,
  tag: string
): Promise<boolean> {
  const apiKey = process.env.MAILCHIMP_API_KEY;
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;
  const serverPrefix = getServerPrefix();

  if (!apiKey || !audienceId || !serverPrefix) {
    return false;
  }

  try {
    const authHeader = Buffer.from(`anystring:${apiKey}`).toString("base64");
    const subscriberHash = crypto.createHash("md5").update(email.toLowerCase().trim()).digest("hex");
    const url = `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${audienceId}/members/${subscriberHash}/tags`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${authHeader}`,
      },
      body: JSON.stringify({
        tags: [{ name: tag, status: "active" }],
      }),
    });

    return response.ok;
  } catch (error) {
    console.error("[mailchimp] Failed to tag subscriber:", error);
    return false;
  }
}
