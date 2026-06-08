import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalLayout, LegalSection } from "@/components/legal-layout";

export const Route = createFileRoute("/dmca")({
  head: () => ({
    meta: [
      { title: "DMCA & Content Policy — ViralSnap" },
      { name: "description", content: "How to report copyright infringement or other policy violations on ViralSnap." },
      { property: "og:title", content: "DMCA & Content Policy — ViralSnap" },
      { property: "og:description", content: "Report copyright infringement on ViralSnap." },
      { property: "og:url", content: "https://viralsnap.online/dmca" },
    ],
    links: [{ rel: "canonical", href: "https://viralsnap.online/dmca" }],
  }),
  component: DmcaPage,
});

function DmcaPage() {
  return (
    <LegalLayout title="DMCA & Content Policy" updated="June 8, 2026">
      <p className="mt-6 text-sm text-foreground/90">
        ViralSnap respects intellectual property rights and expects users to do the same. If you believe content
        on ViralSnap infringes your copyright, or violates our{" "}
        <Link to="/terms" className="text-gold">Terms of Service</Link>, please send a notice to{" "}
        <a className="text-gold" href="mailto:support@viralsnap.online">support@viralsnap.online</a>.
      </p>

      <LegalSection title="What to include in a DMCA notice">
        <ul>
          <li>Your full legal name, address, phone number, and email.</li>
          <li>Identification of the copyrighted work (or a representative list).</li>
          <li>The exact URL(s) on ViralSnap of the allegedly infringing material.</li>
          <li>A statement that you have a good-faith belief the use is not authorized by the owner, agent, or law.</li>
          <li>A statement, under penalty of perjury, that the information is accurate and you are the owner or authorized to act on the owner&apos;s behalf.</li>
          <li>Your physical or electronic signature.</li>
        </ul>
        <p>Incomplete notices may not be actionable.</p>
      </LegalSection>

      <LegalSection title="Counter-notice">
        If your content was removed and you believe it was a mistake or misidentification, you may send a
        counter-notice including the items above plus a statement, under penalty of perjury, that the content was
        removed by mistake or misidentification, and your consent to jurisdiction of the federal court in your
        district.
      </LegalSection>

      <LegalSection title="Repeat infringers">
        Accounts that receive repeated valid copyright notices, or that repeatedly violate our Terms, will be
        terminated.
      </LegalSection>

      <LegalSection title="Other content reports">
        To report harassment, non-consensual imagery, impersonation, or other policy violations, email{" "}
        <a className="text-gold" href="mailto:support@viralsnap.online">support@viralsnap.online</a> with links and
        a brief description. We review reports as quickly as we can.
      </LegalSection>
    </LegalLayout>
  );
}
