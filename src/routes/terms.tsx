import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalLayout, LegalSection } from "@/components/legal-layout";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — ViralSnap" },
      { name: "description", content: "The rules for using ViralSnap — accounts, content, payments, and AI features." },
      { property: "og:title", content: "Terms of Service — ViralSnap" },
      { property: "og:description", content: "Rules for using ViralSnap." },
      { property: "og:url", content: "https://viralsnap.online/terms" },
    ],
    links: [{ rel: "canonical", href: "https://viralsnap.online/terms" }],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <LegalLayout title="Terms of Service" updated="June 8, 2026">
      <p className="mt-6 text-sm text-foreground/90">
        These Terms govern your use of ViralSnap (&quot;we&quot;). By using ViralSnap you agree to these Terms.
        If you don&apos;t agree, don&apos;t use the service.
      </p>

      <LegalSection title="Accounts">
        You must be 13+ (16+ in the EEA) to create an account. You&apos;re responsible for your credentials and
        everything posted under your account. One person per account; no impersonation.
      </LegalSection>

      <LegalSection title="Your content">
        You keep ownership of the videos, images, and text you upload. By posting, you grant us a worldwide,
        non-exclusive, royalty-free license to host, store, reproduce, transcode, display, and stream your
        content for the purpose of operating and promoting the service. This license ends when you delete the
        content, except for copies retained in backups for a limited time.
      </LegalSection>

      <LegalSection title="AI features">
        ViralSnap Pro offers AI tools that generate suggested titles, captions, and hashtags. You are responsible
        for the prompts you submit and the content you publish. Do not use AI features to generate content that
        infringes someone else&apos;s rights or violates the rules below.
      </LegalSection>

      <LegalSection title="Acceptable use — you may NOT post">
        <ul>
          <li>Content you don&apos;t have rights to (footage, music, images, voice clones, or trademarks you don&apos;t own or have licensed).</li>
          <li>Sexual content involving minors, or any content that exploits minors.</li>
          <li>Non-consensual intimate imagery, doxxing, threats, harassment, or incitement to violence.</li>
          <li>Hate speech, illegal content, malware, spam, or schemes to defraud users.</li>
          <li>Voice or likeness of a real person without their consent.</li>
          <li>Attempts to scrape, reverse engineer, or disrupt the service.</li>
        </ul>
      </LegalSection>

      <LegalSection title="Payments, coins, gifts & subscriptions">
        ViralCoin purchases, gifts, and subscriptions (ViralSnap Pro and creator support) are processed by
        Stripe. Subscriptions renew automatically until canceled in your billing portal. Coins and gifts are
        non-refundable except where required by law. Platform fees and creator payouts are disclosed at checkout.
        Taxes may apply based on your location. See our <Link to="/refunds" className="text-gold">Refund Policy</Link>.
      </LegalSection>

      <LegalSection title="Termination">
        You can delete your account at any time from{" "}
        <Link to="/settings" className="text-gold">your settings</Link>. We may suspend or terminate accounts
        that violate these Terms or applicable law, with or without notice.
      </LegalSection>

      <LegalSection title="Disclaimers">
        ViralSnap is provided &quot;as is&quot;. We don&apos;t warrant the service will be uninterrupted,
        error-free, or that AI outputs will be accurate, lawful, or fit for any purpose. To the maximum extent
        allowed by law, we disclaim all implied warranties.
      </LegalSection>

      <LegalSection title="Limitation of liability">
        To the fullest extent permitted by law, our total liability for any claim arising out of or relating to
        the service is limited to the greater of (a) the amount you paid us in the 12 months before the claim or
        (b) USD $100.
      </LegalSection>

      <LegalSection title="Governing law">
        These Terms are governed by the laws of the United States and the state of the operator&apos;s residence,
        without regard to conflict-of-laws rules. Disputes will be resolved in the courts located there, unless
        you have non-waivable rights to your local courts.
      </LegalSection>

      <LegalSection title="Changes">
        We may update these Terms. Material changes will be announced in-app. Continued use after changes means
        you accept the new Terms.
      </LegalSection>
    </LegalLayout>
  );
}
