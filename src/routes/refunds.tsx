import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalLayout, LegalSection } from "@/components/legal-layout";

export const Route = createFileRoute("/refunds")({
  head: () => ({
    meta: [
      { title: "Refund Policy — ViralSnap" },
      { name: "description", content: "Refund and cancellation policy for ViralSnap Pro, creator subscriptions, coins, and gifts." },
      { property: "og:title", content: "Refund Policy — ViralSnap" },
      { property: "og:description", content: "How refunds and cancellations work on ViralSnap." },
      { property: "og:url", content: "https://viralsnap.online/refunds" },
    ],
    links: [{ rel: "canonical", href: "https://viralsnap.online/refunds" }],
  }),
  component: RefundsPage,
});

function RefundsPage() {
  return (
    <LegalLayout title="Refund & Cancellation Policy" updated="June 8, 2026">
      <LegalSection title="ViralSnap Pro subscriptions">
        <ul>
          <li>Cancel anytime in your <Link to="/settings" className="text-gold">settings</Link> → Manage subscriptions. You keep Pro access until the end of the current billing period.</li>
          <li>We don&apos;t pro-rate refunds for partial months.</li>
          <li>If you were billed by mistake (duplicate charge, billing after cancellation), email <a className="text-gold" href="mailto:support@viralsnap.online">support@viralsnap.online</a> within 14 days for a full refund.</li>
        </ul>
      </LegalSection>

      <LegalSection title="Creator subscriptions">
        <ul>
          <li>You can cancel a creator subscription at any time from your settings. Access continues until the end of the paid month.</li>
          <li>Creator subscriptions are non-refundable except in cases of fraud, billing error, or content that violates our <Link to="/guidelines" className="text-gold">Community Guidelines</Link>.</li>
        </ul>
      </LegalSection>

      <LegalSection title="ViralCoins & gifts">
        <p>Coin purchases and gifts are <strong>final and non-refundable</strong>. Gifts are sent directly to creators and are not subject to cancellation. Exceptions:</p>
        <ul>
          <li>Unauthorized charge / payment fraud — contact us within 14 days.</li>
          <li>The recipient creator account is terminated for policy violations before the gift is processed.</li>
        </ul>
      </LegalSection>

      <LegalSection title="EU/UK consumers">
        If you&apos;re a consumer in the EU or UK, you may have a 14-day right of withdrawal on subscription
        purchases under the Consumer Rights Directive. By starting to use the digital service immediately at
        checkout, you waive this right — but you can still cancel future renewals at any time.
      </LegalSection>

      <LegalSection title="How to request a refund">
        Email <a className="text-gold" href="mailto:support@viralsnap.online">support@viralsnap.online</a> from the
        address on your account. Include the date, amount, and what you&apos;d like refunded. We respond within 3
        business days.
      </LegalSection>

      <LegalSection title="Chargebacks">
        We prefer working directly with you. Filing a chargeback without first contacting us may result in account
        suspension while the dispute is investigated.
      </LegalSection>
    </LegalLayout>
  );
}
