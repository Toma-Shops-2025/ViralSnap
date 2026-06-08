import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalLayout, LegalSection } from "@/components/legal-layout";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — ViralSnap" },
      { name: "description", content: "How ViralSnap collects, uses, and protects your data." },
      { property: "og:title", content: "Privacy Policy — ViralSnap" },
      { property: "og:description", content: "How ViralSnap collects, uses, and protects your data." },
      { property: "og:url", content: "https://viralsnap.online/privacy" },
    ],
    links: [{ rel: "canonical", href: "https://viralsnap.online/privacy" }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" updated="June 8, 2026">
      <p className="mt-6 text-sm text-foreground/90">
        ViralSnap (&quot;we&quot;, &quot;us&quot;) explains here what we collect, why, and the choices
        you have. Questions:{" "}
        <a href="mailto:support@viralsnap.online" className="text-gold">support@viralsnap.online</a>.
      </p>

      <LegalSection title="Information we collect">
        <ul>
          <li><b>Account data</b>: email, display name, username, avatar, and (if you sign in with Google) basic profile info from your Google account.</li>
          <li><b>Content you upload</b>: videos, thumbnails, titles, captions, hashtags, comments, and any text you submit.</li>
          <li><b>Usage data</b>: posts you view, like, comment on, follow; device, browser, and approximate location derived from IP.</li>
          <li><b>Payments</b>: handled by Stripe. We do not see or store full card numbers; we store transaction IDs and amounts for coin purchases, gifts, and subscriptions.</li>
        </ul>
      </LegalSection>

      <LegalSection title="How we use your data">
        <ul>
          <li>Provide the service: hosting your videos, the feed, comments, likes, follows, gifts, ViralCoins, live streams, and Pro subscriptions.</li>
          <li>Power AI features (e.g. Google Gemini via Lovable AI Gateway) to generate titles, captions, and hashtags from prompts you submit when you opt in.</li>
          <li>Prevent abuse, enforce our Terms, and comply with legal obligations.</li>
          <li>Email you about your account or important changes (no marketing email is sent without consent).</li>
        </ul>
      </LegalSection>

      <LegalSection title="Third parties we share data with">
        <ul>
          <li><b>Supabase</b> — database, authentication, file storage.</li>
          <li><b>Stripe</b> — payments, subscriptions, tax forms.</li>
          <li><b>Mux</b> — video hosting, encoding, and streaming.</li>
          <li><b>Google / Lovable AI Gateway</b> — AI generation of content you submit for those features.</li>
          <li><b>Cloudflare / Lovable</b> — hosting and edge delivery.</li>
        </ul>
        <p>We do not sell your personal data.</p>
      </LegalSection>

      <LegalSection title="AI-generated content">
        Prompts you submit for AI title, caption, and hashtag generation are sent to our AI provider only to
        produce those suggestions and are not used by us to train models. You are responsible for the content
        you publish.
      </LegalSection>

      <LegalSection title="Cookies & local storage">
        We use cookies and local storage strictly for sign-in sessions and remembering your preferences. We do
        not use third-party advertising cookies.
      </LegalSection>

      <LegalSection title="Your rights">
        You can edit or delete your posts at any time. You can permanently delete your account and associated
        data from <Link to="/settings" className="text-gold">your settings</Link>, or follow the steps on our{" "}
        <Link to="/account-deletion" className="text-gold">account deletion page</Link>. EU/UK/California residents
        have additional rights (access, correction, portability) — email us to exercise them.
      </LegalSection>

      <LegalSection title="Data retention">
        Account, profile, and post data are kept until you delete them or your account. Payment records are
        retained as required by tax/accounting law. Backups are purged on a rolling 30-day cycle.
      </LegalSection>

      <LegalSection title="Children">
        ViralSnap is not directed to children under 13 (or under 16 in the EEA). Do not use the service if you
        are under those ages.
      </LegalSection>

      <LegalSection title="Changes">
        We may update this policy. Material changes will be announced in-app or by email. Continued use means you
        accept the updated policy.
      </LegalSection>
    </LegalLayout>
  );
}
