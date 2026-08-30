// Beautiful on-brand email templates for Tender Trimesters.
// These return HTML strings ready for Resend.

export function welcomePremiumEmail(name: string, tier: string) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to Premium, ${name} 💛</title>
</head>
<body style="margin:0;padding:0;background-color:#F6EDDA;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F6EDDA;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom:24px;">
              <div style="width:48px;height:48px;border-radius:50%;background:linear-gradient(145deg,#3D5A32,#6B8F5B);display:inline-flex;align-items:center;justify-content:center;">
                <span style="color:#F6EDDA;font-size:22px;">🍃</span>
              </div>
            </td>
          </tr>

          <!-- Header -->
          <tr>
            <td align="center" style="padding-bottom:8px;">
              <h1 style="margin:0;font-size:28px;color:#3D5A32;font-weight:400;line-height:1.2;">Welcome to Premium, ${name}</h1>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <p style="margin:0;font-size:15px;color:#BE5068;font-style:italic;">Everything is unlocked. This is your season, mama.</p>
            </td>
          </tr>

          <!-- Main card -->
          <tr>
            <td>
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F9F4E8;border-radius:20px;border:1px solid rgba(200,188,144,0.3);overflow:hidden;">
                <tr>
                  <td style="padding:28px 28px 8px 28px;">
                    <p style="margin:0 0 16px 0;font-size:15px;color:#1A1610;line-height:1.7;">You did it. You're officially part of the Tender Trimesters premium family. Here's what just opened up for you:</p>
                  </td>
                </tr>

                <!-- Feature list -->
                <tr>
                  <td style="padding:0 28px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    ${featureRow("∞", "Unlimited Tempie", "Your AI companion at 3am, noon, and every moment between.")}
                    ${featureRow("📸", "Bump Photo Gallery", "Document your beautiful growing story, week by week.")}
                    ${featureRow("👫", "Partner Access", "Bring your person along for the journey.")}
                    ${featureRow("🧘‍♀️", "Guided Meditations", "Sensual, flowing meditations for every trimester.")}
                    ${featureRow("💌", "All 9 Signature Keepsakes", "Letters from Baby, Fear to Flame, DreamKeeper, and more.")}
                    ${featureRow("📚", "Mommies Matter Digital Bundle", "Ebook, affirmation deck, checklist & letter templates.")}
                  </table>
                  </td>
                </tr>

                <tr>
                  <td style="padding:24px 28px 28px 28px;">
                    <p style="margin:0 0 16px 0;font-size:15px;color:#1A1610;line-height:1.7;">Your plan: <strong>${tier === "one_time" ? "One-time $9.99 — yours forever" : "Monthly $4.99/mo — cancel anytime"}</strong></p>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" style="padding:16px 0 0 0;">
                          <a href="https://tendertrimesters.com" style="display:inline-block;background:linear-gradient(145deg,#BE5068,#CA5C36);color:#F6EDDA;text-decoration:none;padding:14px 32px;border-radius:999px;font-size:15px;font-weight:500;">Open the App</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Ebook section -->
          <tr>
            <td style="padding-top:24px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(145deg,#3D5A32,#6B8F5B);border-radius:20px;overflow:hidden;">
                <tr>
                  <td style="padding:28px;">
                    <p style="margin:0 0 8px 0;font-size:11px;text-transform:uppercase;letter-spacing:0.15em;color:#F0A0AC;">Your Digital Bundle</p>
                    <p style="margin:0 0 16px 0;font-size:18px;color:#F6EDDA;font-weight:400;line-height:1.4;">Mommies Matter: The Ebook</p>
                    <p style="margin:0 0 20px 0;font-size:14px;color:rgba(246,237,218,0.75);line-height:1.6;">Your complete guide — 17 chapters covering epidural decisions, feeding, NICU, postpartum healing, and so much more.</p>
                    <a href="https://www.amazon.com/dp/B0D7L7L2R4" style="display:inline-block;background:rgba(246,237,218,0.15);color:#F6EDDA;text-decoration:none;padding:12px 28px;border-radius:999px;font-size:14px;border:1px solid rgba(246,237,218,0.25);">Get Your Ebook on Amazon</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding:32px 0 0 0;">
              <p style="margin:0 0 4px 0;font-size:13px;color:#BE5068;font-style:italic;">made with love, mama</p>
              <p style="margin:0;font-size:11px;color:rgba(26,22,16,0.4);">Tender Trimesters by Mommies Matter · Helena-Ann Baker</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function ebookOnlyEmail(name: string) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your Mommies Matter Ebook is Here 📚</title>
</head>
<body style="margin:0;padding:0;background-color:#F6EDDA;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F6EDDA;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom:24px;">
              <div style="width:48px;height:48px;border-radius:50%;background:linear-gradient(145deg,#3D5A32,#6B8F5B);display:inline-flex;align-items:center;justify-content:center;">
                <span style="color:#F6EDDA;font-size:22px;">🍃</span>
              </div>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding-bottom:8px;">
              <h1 style="margin:0;font-size:28px;color:#3D5A32;font-weight:400;line-height:1.2;">Your ebook is ready, ${name}</h1>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <p style="margin:0;font-size:15px;color:#BE5068;font-style:italic;">17 chapters of everything you need to know, mama.</p>
            </td>
          </tr>

          <!-- Main card -->
          <tr>
            <td>
              <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(145deg,#3D5A32,#6B8F5B);border-radius:20px;overflow:hidden;">
                <tr>
                  <td style="padding:32px;">
                    <p style="margin:0 0 6px 0;font-size:11px;text-transform:uppercase;letter-spacing:0.15em;color:#F0A0AC;">Mommies Matter</p>
                    <p style="margin:0 0 16px 0;font-size:22px;color:#F6EDDA;font-weight:400;line-height:1.3;">The Complete Guide to Your Pregnancy Journey</p>
                    <p style="margin:0 0 24px 0;font-size:14px;color:rgba(246,237,218,0.75);line-height:1.7;">Thank you for supporting Mommies Matter! Your purchase includes the full ebook covering epidural decisions, feeding choices, NICU prep, postpartum healing, and so much more — written by Helena-Ann Baker from real mama experience.</p>
                    <a href="https://www.amazon.com/dp/B0D7L7L2R4" style="display:inline-block;background:rgba(246,237,218,0.15);color:#F6EDDA;text-decoration:none;padding:14px 32px;border-radius:999px;font-size:15px;border:1px solid rgba(246,237,218,0.25);">Get Your Ebook on Amazon</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Upsell -->
          <tr>
            <td style="padding-top:24px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F9F4E8;border-radius:16px;border:1px solid rgba(200,188,144,0.3);">
                <tr>
                  <td style="padding:24px;">
                    <p style="margin:0 0 8px 0;font-size:11px;text-transform:uppercase;letter-spacing:0.15em;color:#BE5068;">Love it? Go deeper.</p>
                    <p style="margin:0 0 8px 0;font-size:16px;color:#3D5A32;line-height:1.4;">Get the full Tender Trimesters app — premium includes this ebook plus an AI companion, journal, keepsakes, and 40 weeks of guided content.</p>
                    <a href="https://tendertrimesters.com" style="color:#BE5068;text-decoration:none;font-size:14px;">Explore Premium →</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding:32px 0 0 0;">
              <p style="margin:0 0 4px 0;font-size:13px;color:#BE5068;font-style:italic;">made with love, mama</p>
              <p style="margin:0;font-size:11px;color:rgba(26,22,16,0.4);">Tender Trimesters by Mommies Matter · Helena-Ann Baker</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// Helper: creates a feature row for the premium email
function featureRow(emoji: string, title: string, desc: string) {
  return `
    <tr>
      <td style="padding:8px 0;border-bottom:1px solid rgba(200,188,144,0.15);">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td width="36" valign="top" style="padding-right:12px;padding-top:2px;">
              <span style="font-size:18px;">${emoji}</span>
            </td>
            <td>
              <p style="margin:0 0 2px 0;font-size:14px;color:#3D5A32;font-weight:600;">${title}</p>
              <p style="margin:0;font-size:13px;color:rgba(26,22,16,0.6);line-height:1.5;">${desc}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>`;
}
