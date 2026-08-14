import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — Tender Trimesters",
  description: "Terms and conditions for using Tender Trimesters by Mommies Matter.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <a href="/" className="text-sm text-moss hover:underline">
          &larr; Back to Tender Trimesters
        </a>
        <h1 className="font-serif text-3xl text-moss-deep mt-8">Terms of Service</h1>
        <p className="text-xs text-muted-foreground mt-2">
          Effective: August 15, 2026 &middot; Mommies Matter
        </p>

        <div className="prose prose-sm mt-8 space-y-6 text-foreground/85 leading-relaxed">
          <section>
            <h2 className="font-serif text-xl text-moss-deep mt-8">1. Acceptance</h2>
            <p>
              By creating an account or using Tender Trimesters, you agree to these Terms
              of Service. If you do not agree, please do not use the app.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-moss-deep mt-8">2. Description of Service</h2>
            <p>
              Tender Trimesters is a pregnancy companion application that provides weekly
              content, mood tracking, journaling, AI chat, guided meditations, and
              premium features such as baby letters, fear reframing, dream analysis,
              name exploration, memory capsules, and birth playlists. The service is
              provided by Mommies Matter.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-moss-deep mt-8">3. Accounts</h2>
            <p>
              You must provide accurate information when creating your account. You are
              responsible for maintaining the confidentiality of your password. You must
              be at least 18 years old to use this service.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-moss-deep mt-8">4. Premium Subscriptions</h2>
            <p>
              Premium features are available via one-time purchase or monthly subscription
              through Stripe. Payments are non-refundable except as required by law. You
              may cancel a monthly subscription at any time; access continues until the
              end of your billing period. One-time purchases grant permanent access to
              premium features.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-moss-deep mt-8">5. User Content</h2>
            <p>
              You retain ownership of all content you create in the app (journal entries,
              photos, letters, dreams, etc.). By using the service, you grant us a limited
              license to store and display your content back to you within the app. We do
              not use your content for marketing or any other purpose without your
              explicit consent.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-moss-deep mt-8">6. AI-Generated Content</h2>
            <p>
              AI features (Tempie, Letters from Baby, Fear to Flame, DreamKeeper) generate
              content for informational and emotional support purposes only. This content
              is not medical advice, diagnosis, or treatment. Always consult your
              healthcare provider for medical decisions.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-moss-deep mt-8">7. Medical Disclaimer</h2>
            <p>
              <strong>Tender Trimesters is not a medical device and does not provide
              medical advice.</strong> The content, including weekly pregnancy information,
              AI responses, and meditations, is for informational and emotional wellness
              purposes only. Always seek the advice of your physician, midwife, or other
              qualified health provider with any questions you may have regarding a
              medical condition.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-moss-deep mt-8">8. Partner Access</h2>
            <p>
              When you generate a partner link, you grant read-only access to your
              pregnancy progress, weekly content, and bump photos. Your partner cannot
              see your journal, fears, dreams, or letters. You may revoke partner access
              at any time by generating a new link or contacting us.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-moss-deep mt-8">9. Prohibited Conduct</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Using the service for any unlawful purpose</li>
              <li>Attempting to access another user&rsquo;s account or data</li>
              <li>Uploading content that is harmful, threatening, or harassing</li>
              <li>Reverse-engineering, decompiling, or disassembling the service</li>
              <li>Reselling or redistributing the service without authorization</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl text-moss-deep mt-8">10. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, Mommies Matter shall not be liable
              for any indirect, incidental, special, consequential, or punitive damages
              arising from your use of the service. Our total liability shall not exceed
              the amount you paid to us in the twelve months preceding the claim.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-moss-deep mt-8">11. Termination</h2>
            <p>
              We reserve the right to suspend or terminate accounts that violate these
              terms. You may delete your account at any time by contacting us. Upon
              deletion, your personal data will be removed within 30 days.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-moss-deep mt-8">12. Contact</h2>
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
