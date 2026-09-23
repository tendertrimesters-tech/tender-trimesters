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
  source?: string;
}

interface MailchimpResponse {
  id: string;
  email_address: string;
  status: string;
}

/**
 * Get the Mailchimp server prefix from the API key.
 * API keys look like: "abcdef1234567890-us5"
 * The part after the dash is the server prefix.
 */
function getServerPrefix(): string | null {
  const key = process.env.MAILCHIMP_API_KEY;
  if (!key) return null;
  const parts = key.split("-");
  return parts.length > 1 ? parts[parts.length - 1] : null;
}

/**
 * Check if Mailchimp is configured (both API key and audience ID are set).
 */
export function isMailchimpConfigured(): boolean {
  return Boolean(
    process.env.MAILCHIMP_API_KEY && process.env.MAILCHIMP_AUDIENCE_ID
  );
}

/**
 * Add or update a subscriber in the Mailchimp audience.
 * Uses upsert semantics — if the email already exists, it updates; otherwise, it creates.
 *
 * @param email - The subscriber's email address
 * @param name - Optional first name (will be split if full name provided)
 * @param source - Optional source tag (e.g., "landing_hero", "tiktok_launch")
 * @returns true if successful, false if Mailchimp is not configured or the request failed
 */
export async function addMailchimpSubscriber(
  email: string,
  name?: string | null,
  source?: string | null
): Promise<boolean> {
  const apiKey = process.env.MAILCHIMP_API_KEY;
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;
  const serverPrefix = getServerPrefix();

  if (!apiKey || !audienceId || !serverPrefix) {
    console.log(
      "[mailchimp] Not configured — skipping. Set MAILCHIMP_API_KEY and MAILCHIMP_AUDIENCE_ID in Vercel."
    );
    return false;
  }

  // Parse the name — Mailchimp wants FNAME and LNAME separately
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
    // Mailchimp uses HTTP Basic Auth with the API key as the password
    // and any string as the username (conventionally "anystring")
    const authHeader = Buffer.from(`anystring:${apiKey}`).toString("base64");

    const url = `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${audienceId}/members/${encodeURIComponent(
      email.toLowerCase().trim()
    )}`;

    const response = await fetch(url, {
      method: "PUT", // PUT = upsert (create or update)
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${authHeader}`,
      },
      body: JSON.stringify(memberData),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(
        `[mailchimp] API error ${response.status}: ${errorBody}`
      );
      return false;
    }

    const data = (await response.json()) as MailchimpResponse;
    console.log(
      `[mailchimp] ✓ Added/updated subscriber: ${data.email_address} (status: ${data.status})`
    );
    return true;
  } catch (error) {
    console.error("[mailchimp] Failed to add subscriber:", error);
    return false;
  }
}

/**
 * Add a tag to an existing subscriber (e.g., "premium", "ebook_buyer").
 * Useful for segmenting your audience later.
 */
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
    const subscriberHash = encodeURIComponent(email.toLowerCase().trim());

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
