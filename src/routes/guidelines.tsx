import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalLayout, LegalSection } from "@/components/legal-layout";

export const Route = createFileRoute("/guidelines")({
  head: () => ({
    meta: [
      { title: "Community Guidelines — ViralSnap" },
      { name: "description", content: "What's allowed and what isn't on ViralSnap, and how we keep the platform safe." },
      { property: "og:title", content: "Community Guidelines — ViralSnap" },
      { property: "og:description", content: "What's allowed and what isn't on ViralSnap." },
      { property: "og:url", content: "https://viralsnap.online/guidelines" },
    ],
    links: [{ rel: "canonical", href: "https://viralsnap.online/guidelines" }],
  }),
  component: GuidelinesPage,
});

function GuidelinesPage() {
  return (
    <LegalLayout title="Community Guidelines" updated="June 8, 2026">
      <p className="mt-6 text-sm text-foreground/90">
        ViralSnap is a home for short-form video creators. To keep it that way, everyone — viewer or creator —
        agrees to these rules. Violations can result in content removal, suspension, or permanent ban.
      </p>

      <LegalSection title="Absolutely not allowed">
        <ul>
          <li><strong>Child sexual abuse material (CSAM).</strong> Any sexualized content involving minors will be removed, the account terminated, and reported to NCMEC and law enforcement.</li>
          <li><strong>Non-consensual intimate content</strong> (including AI-generated nudes of real people).</li>
          <li><strong>Voice or likeness of real people without consent</strong> — no deepfakes of real public figures or private individuals.</li>
          <li><strong>Threats of violence, doxxing, or stalking.</strong></li>
          <li><strong>Hate speech</strong> targeting people based on race, ethnicity, religion, gender, sexual orientation, disability, or other protected characteristics.</li>
          <li><strong>Glorification of self-harm, suicide, or eating disorders.</strong></li>
          <li><strong>Sale or promotion of illegal goods</strong> (drugs, weapons, stolen property).</li>
          <li><strong>Copyrighted video or music</strong> you don&apos;t own or aren&apos;t licensed for. See our <Link to="/dmca" className="text-gold">DMCA policy</Link>.</li>
        </ul>
      </LegalSection>

      <LegalSection title="Respect other creators">
        No targeted harassment, brigading, or coordinated downvoting. Disagreement is fine; abuse isn&apos;t.
      </LegalSection>

      <LegalSection title="Reporting & enforcement">
        <ul>
          <li>Use the report option on any post, comment, or profile to flag it.</li>
          <li>We review reports as quickly as we can — typically within 24–72 hours.</li>
          <li>Repeat offenders are permanently banned. Account terminations include all content, gifts received, and subscriptions.</li>
          <li>If your account was actioned and you believe it was a mistake, email <a className="text-gold" href="mailto:support@viralsnap.online">support@viralsnap.online</a>.</li>
        </ul>
      </LegalSection>

      <LegalSection title="Minimum age">
        You must be at least <strong>13 years old</strong> to use ViralSnap. To buy coins, send gifts, or
        subscribe, you must be <strong>18 or older</strong> (or the age of majority in your jurisdiction).
      </LegalSection>
    </LegalLayout>
  );
}
