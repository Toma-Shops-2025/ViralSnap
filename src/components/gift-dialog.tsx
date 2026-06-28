import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { GIFTS, type GiftType } from "@/lib/gifts";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  receiverId: string;
  receiverName: string;
  videoId?: string;
  streamId?: string;
};

export function GiftDialog({ open, onOpenChange, receiverId, receiverName, videoId, streamId }: Props) {
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<GiftType | null>(null);
  const [sending, setSending] = useState(false);

  const gift = GIFTS.find((g) => g.type === selected);
  const balance = profile?.coin_balance ?? 0;

  const handleSend = async () => {
    if (!user) {
      onOpenChange(false);
      navigate({ to: "/welcome" });
      return;
    }
    if (!gift) return;
    if (balance < gift.coins) {
      toast.error("Not enough ViralCoins", {
        description: "Top up your wallet to keep the support flowing.",
      });
      return;
    }
    setSending(true);
    const { error } = await supabase.rpc("send_gift", {
      _receiver_id: receiverId,
      _gift_type: gift.type,
      _coin_amount: gift.coins,
      _video_id: videoId ?? undefined,
      _stream_id: streamId ?? undefined,
    });
    setSending(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(`${gift.emoji} ${gift.label} sent to @${receiverName}!`, {
      description: `${Math.floor(gift.coins * 0.7)} coins went straight to the creator.`,
    });
    await refreshProfile();
    setSelected(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-border bg-card">
        <DialogHeader>
          <DialogTitle className="font-display">Send a gift to @{receiverName}</DialogTitle>
          <DialogDescription>
            Creators keep 70% of every gift. You have{" "}
            <span className="font-semibold text-gold">{balance.toLocaleString()}</span> ViralCoins.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-3 py-2">
          {GIFTS.map((g) => (
            <button
              key={g.type}
              onClick={() => setSelected(g.type)}
              className={cn(
                "flex flex-col items-center gap-1 rounded-2xl border p-3 transition-all",
                selected === g.type
                  ? "border-primary bg-accent shadow-glow"
                  : "border-border bg-secondary/40 hover:border-primary/50",
              )}
            >
              <span className="text-3xl">{g.emoji}</span>
              <span className="text-xs font-medium">{g.label}</span>
              <span className="text-xs font-semibold text-gold">{g.coins}</span>
            </button>
          ))}
        </div>

        <Button
          onClick={handleSend}
          disabled={!gift || sending}
          className="w-full rounded-full bg-gradient-fire text-primary-foreground shadow-glow hover:opacity-90"
        >
          {!user
            ? "Sign in to gift"
            : gift
              ? `Send ${gift.emoji} for ${gift.coins} coins`
              : "Pick a gift"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
