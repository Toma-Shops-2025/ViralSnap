import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalLayout, LegalSection } from "@/components/legal-layout";

// Public page required by Google Play's Child Safety Standards policy.
// Must be reachable by anyone (signed in or not), active, and non-editable
// from the outside so it can be used as the "Safety standards URL".
export const Route = createFileRoute("/child-safety")({
  head: () => ({
    meta: [
      { title: "Child Safety Standards — ViralSnap" },
      { name: "description", content: "ViralSnap's standards against child sexual abuse and exploitation (CSAE), including our prohibitions, reporting, and enforcement practices." },
      { property: "og:title", content: "Child Safety Standards — ViralSnap" },
      { property: "og:description", content: "ViralSnap's standards against child sexual abuse and exploitation (CSAE)." },
      { property: "og:url", content: "https://viralsnap.online/child-safety" },
    ],
    links: [{ rel: "canonical", href: "https://viralsnap.online/child-safety" }],
  }),
  component: ChildSafetyPage,
});

function ChildSafetyPage() {
  return (
    <LegalLayout title="Child Safety Standards" updated="June 9, 2026">
      <p className="mt-6 text-sm text-foreground/90">
        ViralSnap has a zero-tolerance policy toward child sexual abuse and exploitation (CSAE)
        and child sexual abuse material (CSAM). These standards explain how we prevent, detect,
        and respond to child sexual abuse and exploitation across our platform. They apply to
        every user and all content on ViralSnap.
      </p>

      <LegalSection title="Our commitment">
        <ul>
          <li>We prohibit any content, behavior, or activity that sexualizes, endangers, or exploits children.</li>
          <li>We act on reports of CSAE quickly and remove violating content and accounts.</li>
          <li>We report apparent CSAM to the National Center for Missing &amp; Exploited Children (NCMEC) and cooperate with law enforcement.</li>
          <li>We design our features to reduce the risk of abuse and to make reporting easy.</li>
        </ul>
      </LegalSection>

      <LegalSection title="Strictly prohibited">
        <ul>
          <li><strong>Child sexual abuse material (CSAM)</strong> — any sexualized content involving a minor, real or generated, is forbidden and reported to NCMEC and law enforcement.</li>
          <li><strong>Sexualization of minors</strong> — including suggestive content, captions, comments, or hashtags that sexualize anyone under 18.</li>
          <li><strong>Grooming and predatory behavior</strong> — attempts to befriend, manipulate, or solicit a minor for sexual purposes.</li>
          <li><strong>Sextortion</strong> — threatening to share intimate imagery to coerce a minor.</li>
          <li><strong>Trafficking or solicitation</strong> — facilitating the sexual exploitation of a minor in any way.</li>
          <li><strong>Sharing or linking to CSAM</strong> anywhere on or off the platform.</li>
        </ul>
      </LegalSection>

      <LegalSection title="Minimum age">
        You must be at least <strong>13 years old</strong> to use ViralSnap. Accounts we believe belong
        to a child under 13 are removed. See our{" "}
        <Link to="/guidelines" className="text-gold">Community Guidelines</Link> and{" "}
        <Link to="/terms" className="text-gold">Terms of Service</Link>.
      </LegalSection>

      <LegalSection title="How to report child safety concerns">
        <ul>
          <li><strong>In the app:</strong> use the report option on any post, comment, profile, or live stream to flag child-safety concerns. Reports are prioritized for urgent review.</li>
          <li><strong>By email:</strong> contact <a className="text-gold" href="mailto:support@viralsnap.online?subject=Child%20Safety%20Report">support@viralsnap.online</a> with the subject &quot;Child Safety Report&quot; and include links and a description.</li>
          <li><strong>To authorities:</strong> in the U.S. you can report directly to the NCMEC CyberTipline at <a className="text-gold" href="https://report.cybertip.org" target="_blank" rel="noopener noreferrer">report.cybertip.org</a> or call 1-800-843-5678. Contact local law enforcement if a child is in immediate danger.</li>
        </ul>
      </LegalSection>

      <LegalSection title="How we respond">
        <ul>
          <li>We review child-safety reports as an urgent priority, ahead of routine moderation.</li>
          <li>We remove violating content and permanently ban the responsible accounts.</li>
          <li>We preserve relevant evidence and report apparent CSAM to NCMEC and law enforcement as required by law.</li>
          <li>We take steps to prevent banned users from creating new accounts (ban evasion).</li>
        </ul>
      </LegalSection>

      <LegalSection title="Designated point of contact">
        Our designated child-safety point of contact can be reached at{" "}
        <a className="text-gold" href="mailto:support@viralsnap.online?subject=CSAE%20Compliance">support@viralsnap.online</a>.
        This contact is able to speak about our CSAM prevention practices and compliance.
      </LegalSection>

      <LegalSection title="Compliance">
        ViralSnap complies with applicable child-safety laws and reports to the relevant regional and
        national authorities, including NCMEC in the United States. We regularly review and update these
        standards.
      </LegalSection>
    </LegalLayout>
  );
}
