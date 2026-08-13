import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Tender Trimesters",
  description: "How Tender Trimesters by Mommies Matter collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <a href="/" className="text-sm text-moss hover:underline">
          &larr; Back to Tender Trimesters
        </a>
        <h1 className="font-serif text-3xl text-moss-deep mt-8">Privacy Policy</h1>
        <p className="text-xs text-muted-foreground mt-2">
          Effective: August 15, 2026 &middot; Mommies Matter
        </p>

        <div className="prose prose-sm mt-8 space-y-6 text-foreground/85 leading-relaxed">
          <section>
            <h2 className="font-serif text-xl text-moss-deep mt-8">1. Information We Collect</h2>
            <p>
              When you create an account, we collect your name, email address, and pregnancy
              information you choose to share (due date, baby name, partner name). This
              information is stored securely and used solely to personalize your experience
              within Tender Trimesters.
            </p>
            <p>
              <strong>Journal entries, mood data, fear entries, dream logs, name seeds,
              memory capsules, baby letters, and bump photos</strong> are stored in our
              database and are never shared with third parties. This content belongs to you.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-moss-deep mt-8">2. How We Use Your Information</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>To calculate your current pregnancy week and display relevant content</li>
              <li>To personalize your AI companion (Tempie) responses</li>
              <li>To provide the partner read-only view you explicitly enable</li>
              <li>To process premium subscription payments via Stripe</li>
              <li>To send essential service emails (account verification, receipts)</li>
            </ul>
            <p className="mt-2">
              We do <strong>not</strong> sell, rent, or share your personal data with
              advertisers or data brokers. Ever.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-moss-deep mt-8">3. AI Features</h2>
            <p>
              Tempie (AI chat), Letters from Baby, Fear to Flame reframing, and DreamKeeper
              symbol analysis send your inputs to our AI provider to generate responses.
              These conversations are stored in your account for your reference. AI
              providers may store data per their own privacy policies; we encourage you
              to review them. We do not use your AI conversations to train models.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-moss-deep mt-8">4. Data Security</h2>
            <p>
              Your data is encrypted in transit (TLS/HTTPS) and at rest. We use industry-standard
              security practices including secure session management, password hashing, and
              access controls. Payment data is processed entirely by Stripe and never
              touches our servers.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-moss-deep mt-8">5. Your Rights</h2>
            <p>You may at any time:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Request a copy of all data we hold about you</li>
              <li>Request deletion of your account and all associated data</li>
              <li>Export your journal entries, photos, and other content</li>
              <li>Opt out of any email communications</li>
            </ul>
            <p className="mt-2">
              To exercise these rights, contact us at{" "}
              <a href="mailto:hello@mommiesmatter.com" className="text-moss hover:underline">
                hello@mommiesmatter.com
              </a>.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-moss-deep mt-8">6. Cookies</h2>
            <p>
              We use essential cookies for authentication (session management via NextAuth).
              We do not use tracking cookies or third-party advertising pixels.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-moss-deep mt-8">7. Third-Party Services</h2>
            <p>
              We integrate with <strong>Stripe</strong> for payment processing and an
              <strong>AI provider</strong> for conversational features. Each service
              operates under their own privacy policy. We chose these partners specifically
              for their strong security and privacy standards.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-moss-deep mt-8">8. Children&rsquo;s Privacy</h2>
            <p>
              Tender Trimesters is designed for expectant parents who are adults. We do not
              knowingly collect information from children under 13.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-moss-deep mt-8">9. Changes to This Policy</h2>
            <p>
              We may update this policy periodically. We will notify you of material
              changes via email or an in-app notice. Your continued use of the service
              after changes constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-moss-deep mt-8">10. Contact</h2>
            <p>
              Mommies Matter
              <br />
              <a href="mailto:hello@mommiesmatter.com" className="text-moss hover:underline">
                hello@mommiesmatter.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
