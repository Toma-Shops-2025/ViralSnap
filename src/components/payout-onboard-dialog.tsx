import { ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

/**
 * Shows the Stripe onboarding link as a real anchor the user taps. A
 * programmatic `window.open`/redirect after an async server call is blocked
 * by mobile browsers and the preview iframe, so we surface a genuine
 * user-gesture link instead.
 */
export function PayoutOnboardDialog({
  url,
  onClose,
}: {
  url: string | null;
  onClose: () => void;
}) {
  return (
    <Dialog open={!!url} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="border-border bg-card sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-display">Continue payout setup</DialogTitle>
          <DialogDescription>
            Your secure payout setup link is ready. It opens in a new tab where
            you'll verify your identity and add a bank account.
          </DialogDescription>
        </DialogHeader>
        {url && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-fire py-3 text-sm font-bold text-primary-foreground shadow-glow transition-opacity hover:opacity-90"
          >
            <ExternalLink className="h-4 w-4" />
            Open payout setup
          </a>
        )}
      </DialogContent>
    </Dialog>
  );
}
