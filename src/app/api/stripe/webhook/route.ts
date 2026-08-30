import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { getEmailClient, getFromAddress, isEmailConfigured } from "@/lib/email";
import { welcomePremiumEmail, ebookOnlyEmail } from "@/lib/email-templates";

// POST /api/stripe/webhook
// Receives Stripe events:
//   - checkout.session.completed → activates premium or delivers ebook
//   - customer.subscription.deleted → revokes monthly premium
//   Also sends automated thank-you emails via Resend.

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 503 });
  }

  const body = await req.text();
  const signature = (await headers()).get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[stripe/webhook] signature verification failed:", message);
    return NextResponse.json({ error: `Invalid signature: ${message}` }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const cs = event.data.object as Stripe.Checkout.Session;
        const userId = cs.metadata?.userId || cs.client_reference_id;
        const tier = cs.metadata?.tier as "one_time" | "monthly" | "ebook_only" | undefined;
        const customerEmail = cs.customer_email || cs.customer_details?.email || "";
        const customerName = cs.customer_details?.name || cs.metadata?.name || "Mama";

        // ── Ebook-only purchase (no user account needed) ──
        if (tier === "ebook_only") {
          console.log("[stripe/webhook] ebook_only purchase:", cs.id, customerEmail);
          // Send ebook delivery email
          if (isEmailConfigured() && customerEmail) {
            await sendEmail({
              to: customerEmail,
              subject: "Your Mommies Matter Ebook is Here 📚",
              html: ebookOnlyEmail(customerName.split(" ")[0]),
            });
          }
          return NextResponse.json({ received: true });
        }

        if (!userId || !tier) {
          console.error("[stripe/webhook] missing userId or tier in session metadata", cs.id);
          return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
        }

        // Idempotency: if user already premium with this session id, skip.
        const existing = await db.user.findUnique({
          where: { id: userId },
          select: { id: true, isPremium: true, stripeCheckoutSessionId: true, name: true, email: true },
        });
        if (!existing) {
          console.error("[stripe/webhook] user not found:", userId);
          return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        if (existing.stripeCheckoutSessionId === cs.id) {
          return NextResponse.json({ received: true, deduplicated: true });
        }

        const subscriptionId = typeof cs.subscription === "string" ? cs.subscription : null;
        const customerId = typeof cs.customer === "string" ? cs.customer : null;

        await db.user.update({
          where: { id: userId },
          data: {
            isPremium: true,
            premiumTier: tier,
            premiumSince: new Date(),
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscriptionId,
            stripeCheckoutSessionId: cs.id,
          },
        });

        console.log("[stripe/webhook] premium activated:", userId, tier, cs.id);

        // Send welcome email
        const firstName = (existing.name || customerName).split(" ")[0];
        const email = existing.email || customerEmail;
        if (isEmailConfigured() && email) {
          await sendEmail({
            to: email,
            subject: `Welcome to Premium, ${firstName} 💛`,
            html: welcomePremiumEmail(firstName, tier),
          });
        }

        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = typeof sub.customer === "string" ? sub.customer : null;
        if (!customerId) break;
        const user = await db.user.findFirst({
          where: { stripeCustomerId: customerId },
          select: { id: true },
        });
        if (user) {
          await db.user.update({
            where: { id: user.id },
            data: {
              isPremium: false,
              premiumTier: null,
              stripeSubscriptionId: null,
            },
          });
          console.log("[stripe/webhook] premium revoked:", user.id);
        }
        break;
      }

      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[stripe/webhook] handler error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// ── Email helper ──

async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  const resend = getEmailClient();
  if (!resend) {
    console.log("[email] Resend not configured — skipping email");
    return;
  }
  try {
    const { data, error } = await resend.emails.send({
      from: getFromAddress(),
      to: [to],
      subject,
      html,
    });
    if (error) {
      console.error("[email] send failed:", error);
    } else {
      console.log("[email] sent:", data?.id, "to:", to);
    }
  } catch (err) {
    console.error("[email] send error:", err);
  }
}
