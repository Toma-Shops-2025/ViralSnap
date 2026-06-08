import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalLayout, LegalSection } from "@/components/legal-layout";

// Public page required by Google Play's Data Safety policy: anyone (signed in
// or not) must be able to find clear instructions for deleting their account.
export const Route = createFileRoute("/account-deletion")({
  head: () => ({
    meta: [
      { title: "Delete your ViralSnap account" },
      { name: "description", content: "Instructions for permanently deleting your ViralSnap account and all associated data." },
      { property: "og:title", content: "Delete your ViralSnap account" },
      { property: "og:description", content: "How to permanently delete your ViralSnap account." },
      { property: "og:url", content: "https://viralsnap.online/account-deletion" },
    ],
    links: [{ rel: "canonical", href: "https://viralsnap.online/account-deletion" }],
  }),
  component: AccountDeletionPage,
});

function AccountDeletionPage() {
  return (
    <LegalLayout title="Delete your ViralSnap account">
      <p className="mt-3 text-sm text-foreground/90">
        You can permanently delete your ViralSnap account and all associated data at any time.
      </p>

      <LegalSection title="Delete from inside the app">
        <ol>
          <li>Open ViralSnap and sign in.</li>
          <li>Go to <Link to="/settings" className="text-gold">Settings</Link> → scroll to the bottom.</li>
          <li>Tap <strong>Delete account</strong> and confirm.</li>
        </ol>
        <p>The deletion is immediate. You&apos;ll be signed out and your data removed.</p>
      </LegalSection>

      <LegalSection title="Delete by email">
        If you can&apos;t access your account, email{" "}
        <a className="text-gold" href="mailto:support@viralsnap.online?subject=Account%20Deletion%20Request">support@viralsnap.online</a>{" "}
        from the address on your account with the subject <strong>&quot;Account Deletion Request&quot;</strong>.
        We process requests within 7 days.
      </LegalSection>

      <LegalSection title="What gets deleted">
        <ul>
          <li>Your profile (username, display name, avatar, bio, links).</li>
          <li>All posts you created, including the video files.</li>
          <li>Your comments, likes, follows, and follower relationships.</li>
          <li>Your account credentials and authentication records.</li>
          <li>Your coin balance and any blocks you&apos;ve created.</li>
        </ul>
      </LegalSection>

      <LegalSection title="What we may retain">
        <ul>
          <li><strong>Payment records</strong> — coin, gift, and subscription transaction history is retained for up to 7 years as required by tax and financial regulations. These records are tied to your previous user ID but do not include profile information.</li>
          <li><strong>Moderation records</strong> — if your account was actioned for policy violations, we retain a minimal record (user ID, date, reason) to prevent ban evasion.</li>
          <li><strong>Backups</strong> — encrypted backups are purged on a rolling 30-day schedule.</li>
        </ul>
      </LegalSection>

      <LegalSection title="Cancel subscriptions first">
        Deleting your account does NOT automatically cancel active paid subscriptions to creators or ViralSnap Pro.
        Please cancel them from your settings first, or email us and we&apos;ll handle it together.
      </LegalSection>
    </LegalLayout>
  );
}
