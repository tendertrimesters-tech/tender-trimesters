// Beautiful on-brand welcome email for waitlist subscribers.
// Sent automatically when someone joins the waitlist.

export function waitlistWelcomeEmail(name: string | null): string {
  const firstName = name ? name.split(" ")[0] : "mama";
  
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to Tender Trimesters 💛</title>
</head>
<body style="margin:0;padding:0;background-color:#F4EAD5;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F4EAD5;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom:24px;">
              <div style="width:48px;height:48px;border-radius:50%;background:linear-gradient(145deg,#2D3F23,#5A7A48);display:inline-flex;align-items:center;justify-content:center;">
                <span style="color:#F4EAD5;font-size:22px;">🍃</span>
              </div>
            </td>
          </tr>

          <!-- Header -->
          <tr>
            <td align="center" style="padding-bottom:8px;">
              <h1 style="margin:0;font-size:28px;color:#2D3F23;font-weight:400;line-height:1.2;">Welcome, ${firstName}</h1>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <p style="margin:0;font-size:15px;color:#A8455D;font-style:italic;">You're on the list. We're so glad you're here.</p>
            </td>
          </tr>

          <!-- Main card -->
          <tr>
            <td>
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#FBF4E0;border-radius:20px;border:1px solid rgba(200,188,144,0.3);overflow:hidden;">
                <tr>
                  <td style="padding:28px 28px 8px 28px;">
                    <p style="margin:0 0 16px 0;font-size:15px;color:#1A1410;line-height:1.7;">Welcome to the Tender Trimesters waitlist. You're officially on the list — and we're so glad you're here.</p>
                    <p style="margin:0 0 16px 0;font-size:15px;color:#1A1410;line-height:1.7;">Over the next 10 days, you'll get a few emails from me. Real ones. Not auto-responder fluff. I'll share my story, give you a peek inside the app, and tell you when we go live.</p>
                  </td>
                </tr>

                <!-- Affirmation card -->
                <tr>
                  <td style="padding:0 28px 28px 28px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:rgba(232,144,152,0.15);border-radius:16px;border-left:3px solid #B85A38;">
                      <tr>
                        <td style="padding:24px;">
                          <p style="margin:0;font-size:11px;color:#A8455D;text-transform:uppercase;letter-spacing:0.2em;margin-bottom:8px;">Your first affirmation</p>
                          <p style="margin:0;font-size:24px;color:#2D3F23;font-family:'Dancing Script',cursive,Georgia,serif;line-height:1.3;">My body knows exactly what to do.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style="padding:0 28px 28px 28px;">
                    <p style="margin:0;font-size:15px;color:#1A1410;line-height:1.7;">Pin it somewhere. Say it out loud. Repeat as needed.</p>
                  </td>
                </tr>

                <!-- CTA -->
                <tr>
                  <td style="padding:0 28px 28px 28px;" align="center">
                    <a href="https://tendertrimesters.com" style="display:inline-block;background:linear-gradient(145deg,#2D3F23,#5A7A48);color:#F4EAD5;text-decoration:none;padding:14px 32px;border-radius:999px;font-size:15px;font-weight:500;">Visit the App</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Signature -->
          <tr>
            <td style="padding:24px 0 0 0;" align="center">
              <p style="margin:0;font-size:15px;color:#2D3F23;line-height:1.7;">With love,<br/><strong>Helena-Ann</strong></p>
              <p style="margin:12px 0 0 0;font-size:12px;color:#5A4F38;">Founder, Tender Trimesters · Mommies Matter</p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:32px 0 0 0;" align="center">
              <p style="margin:0;font-size:11px;color:#5A4F38;opacity:0.7;">You're receiving this because you joined the Tender Trimesters waitlist.</p>
              <p style="margin:8px 0 0 0;font-size:11px;color:#5A4F38;opacity:0.7;">tendertrimesters.com · hello@mommiesmatter.com</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// Plain text version (for email clients that don't render HTML)
export function waitlistWelcomeEmailText(name: string | null): string {
  const firstName = name ? name.split(" ")[0] : "mama";
  return `Welcome, ${firstName}

You're on the list. We're so glad you're here.

Welcome to the Tender Trimesters waitlist. You're officially on the list — and we're so glad you're here.

Over the next 10 days, you'll get a few emails from me. Real ones. Not auto-responder fluff. I'll share my story, give you a peek inside the app, and tell you when we go live.

For now, here's your first affirmation:

"My body knows exactly what to do."

Pin it somewhere. Say it out loud. Repeat as needed.

With love,
Helena-Ann
Founder, Tender Trimesters · Mommies Matter

tendertrimesters.com · hello@mommiesmatter.com
`;
}
