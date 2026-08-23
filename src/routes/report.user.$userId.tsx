import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { BottomNav } from "@/components/bottom-nav";
import { useAuth } from "@/hooks/use-auth";
import { submitReport, type ReportReason } from "@/lib/safety.functions";
import { toast } from "sonner";

const REASONS: { value: ReportReason; label: string }[] = [
  { value: "spam", label: "Spam or scam" },
  { value: "harassment", label: "Harassment or bullying" },
  { value: "hate", label: "Hate speech" },
  { value: "sexual", label: "Sexual content / nudity" },
  { value: "violence", label: "Violence or gore" },
  { value: "csam", label: "Child sexual abuse material" },
  { value: "self_harm", label: "Self-harm or suicide" },
  { value: "impersonation", label: "Impersonation" },
  { value: "ip_violation", label: "Copyright / IP violation" },
  { value: "illegal", label: "Illegal activity" },
  { value: "other", label: "Something else" },
];

export const Route = createFileRoute("/report/user/$userId")({
  validateSearch: (search: Record<string, unknown>) => ({
    username: typeof search.username === "string" ? search.username : undefined,
  }),
  head: () => ({ meta: [{ title: "Report creator — ViralSnap" }] }),
  component: ReportCreatorPage,
});

function ReportCreatorPage() {
  const { userId } = Route.useParams();
  const { username } = Route.useSearch();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [reason, setReason] = useState<ReportReason>("spam");
  const [details, setDetails] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/welcome", replace: true });
  }, [loading, user, navigate]);

  useEffect(() => {
    if (user && user.id === userId) {
      toast.error("You can't report yourself");
      navigate({ to: "/", replace: true });
    }
  }, [user, userId, navigate]);

  const submit = async () => {
    if (!agreed) {
      toast.error("Please confirm you are reporting in good faith.");
      return;
    }
    setSubmitting(true);
    try {
      await submitReport({
        data: {
          targetType: "user",
          targetId: userId,
          reason,
          details: details.trim() || undefined,
        },
      });
      toast.success("Report submitted. Our team will review it.");
      navigate({ to: "/", replace: true });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to submit report");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !user) {
    return <div className="min-h-dvh bg-background" />;
  }

  const label = username ? `@${username}` : "this creator";

  return (
    <div className="min-h-dvh bg-background pb-24">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border/40 bg-background/90 px-4 py-3 backdrop-blur">
        <button
          type="button"
          aria-label="Back"
          onClick={() => navigate({ to: "/" })}
          className="grid h-9 w-9 place-items-center rounded-full hover:bg-secondary/60"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="font-display text-lg font-bold">Report creator</h1>
      </header>

      <div className="mx-auto max-w-md space-y-5 px-4 py-6">
        <p className="text-sm text-muted-foreground">
          Help us keep ViralSnap safe. Select a reason for reporting {label}.
        </p>

        <RadioGroup
          value={reason}
          onValueChange={(v) => setReason(v as ReportReason)}
          className="grid gap-2"
        >
          {REASONS.map((r) => (
            <Label
              key={r.value}
              className="flex cursor-pointer items-center gap-3 rounded-xl border border-border/60 bg-secondary/20 px-4 py-3 text-sm hover:border-primary/40 transition-colors"
            >
              <RadioGroupItem value={r.value} />
              <span>{r.label}</span>
            </Label>
          ))}
        </RadioGroup>

        <div className="space-y-2">
          <Label htmlFor="report-details" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Additional details (optional)
          </Label>
          <Textarea
            id="report-details"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Please provide any specific info..."
            maxLength={1000}
            rows={3}
            className="rounded-xl bg-secondary/40"
          />
        </div>

        <div className="flex items-start gap-3 rounded-xl border border-border/40 bg-secondary/10 p-3">
          <Checkbox
            id="report-agree"
            checked={agreed}
            onCheckedChange={(v) => setAgreed(v === true)}
            className="mt-1"
          />
          <Label htmlFor="report-agree" className="cursor-pointer text-xs leading-relaxed text-muted-foreground">
            I confirm that this report is accurate and submitted in good faith. I understand that
            submitting false reports may result in account action.
          </Label>
        </div>

        <div className="flex gap-2 pt-2">
          <Button variant="outline" onClick={() => navigate({ to: "/" })} className="flex-1 rounded-full">
            Cancel
          </Button>
          <Button
            onClick={submit}
            disabled={submitting || !agreed}
            className="flex-1 rounded-full bg-gradient-fire text-white shadow-glow"
          >
            {submitting ? "Submitting…" : "Submit report"}
          </Button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
