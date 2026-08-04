import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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

export function ReportDialog({
  open,
  onOpenChange,
  targetType,
  targetId,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  targetType: "post" | "comment" | "user";
  targetId: string;
}) {
  const [reason, setReason] = useState<ReportReason>("spam");
  const [details, setDetails] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const reportFn = submitReport;

  const submit = async () => {
    if (!agreed) {
      toast.error("Please confirm you are reporting in good faith.");
      return;
    }
    setSubmitting(true);
    try {
      await reportFn({
        data: { targetType, targetId, reason, details: details.trim() || undefined },
      });
      toast.success("Report submitted. Our team will review it.");
      onOpenChange(false);
      setDetails("");
      setReason("spam");
      setAgreed(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to submit report");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Report {targetType}</DialogTitle>
          <DialogDescription>
            Help us keep ViralSnap safe. Please select a reason for this report.
          </DialogDescription>
        </DialogHeader>

        <RadioGroup value={reason} onValueChange={(v) => setReason(v as ReportReason)} className="grid gap-2 py-2">
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

        <div className="space-y-3 pt-2">
          <Label htmlFor="report-details" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Additional Details (Optional)
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

        <div className="flex items-start gap-3 rounded-xl border border-border/40 bg-secondary/10 p-3 mt-2">
          <Checkbox
            id="report-agree"
            checked={agreed}
            onCheckedChange={(v) => setAgreed(v === true)}
            className="mt-1"
          />
          <Label htmlFor="report-agree" className="text-xs leading-relaxed text-muted-foreground cursor-pointer">
            I confirm that this report is accurate and submitted in good faith. I understand that submitting false reports may result in account action.
          </Label>
        </div>

        <DialogFooter className="gap-2 sm:gap-0 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-full flex-1">
            Cancel
          </Button>
          <Button
            onClick={submit}
            disabled={submitting || !agreed}
            className="rounded-full flex-1 bg-gradient-fire text-white shadow-glow"
          >
            {submitting ? "Submitting…" : "Submit Report"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
