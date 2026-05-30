import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Briefcase, Coins, Calendar, Users, Plus } from "lucide-react";
import { BottomNav } from "@/components/bottom-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { compact, timeAgo } from "@/lib/format";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { Tables, Database } from "@/integrations/supabase/types";

type Campaign = Tables<"campaigns">;
type Category = Database["public"]["Enums"]["campaign_category"];

const CATEGORIES: Category[] = [
  "fashion", "beauty", "tech", "food", "fitness", "gaming", "lifestyle", "music", "travel", "education",
];

export const Route = createFileRoute("/campaigns")({
  head: () => ({
    meta: [
      { title: "Brand Campaigns — ViralSnap" },
      { name: "description", content: "Browse paid brand campaigns and apply to get paid for your content on ViralSnap." },
    ],
  }),
  component: CampaignsPage,
});

async function fetchCampaigns() {
  const { data: campaigns } = await supabase
    .from("campaigns")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(60);
  const ids = [...new Set((campaigns ?? []).map((c) => c.brand_id))];
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, username, display_name, avatar_url")
    .in("id", ids.length ? ids : ["00000000-0000-0000-0000-000000000000"]);
  return {
    campaigns: campaigns ?? [],
    brands: new Map((profiles ?? []).map((p) => [p.id, p])),
  };
}

function CampaignsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [filter, setFilter] = useState<Category | "all">("all");
  const [applyTo, setApplyTo] = useState<Campaign | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const { data } = useQuery({ queryKey: ["campaigns"], queryFn: fetchCampaigns });
  const campaigns = (data?.campaigns ?? []).filter((c) => filter === "all" || c.category === filter);

  return (
    <div className="min-h-[100dvh] pb-28">
      <header className="sticky top-0 z-30 space-y-3 border-b border-border bg-background/80 px-4 py-3 backdrop-blur-xl pt-[calc(0.75rem+env(safe-area-inset-top))]">
        <div className="flex items-center justify-between">
          <h1 className="flex items-center gap-2 font-display text-2xl font-bold">
            <Briefcase className="h-6 w-6 text-primary" /> Campaigns
          </h1>
          <button
            onClick={() => (user ? setShowCreate(true) : navigate({ to: "/auth" }))}
            className="flex items-center gap-1.5 rounded-full bg-gradient-fire px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow"
          >
            <Plus className="h-4 w-4" /> Post
          </button>
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {(["all", ...CATEGORIES] as const).map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={cn(
                "whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold capitalize transition-colors",
                filter === c ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground",
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </header>

      <div className="mx-auto max-w-2xl space-y-3 px-4 py-4">
        {campaigns.length === 0 && (
          <p className="py-16 text-center text-sm text-muted-foreground">No campaigns in this category yet.</p>
        )}
        {campaigns.map((c) => {
          const b = data?.brands.get(c.brand_id);
          return (
            <div key={c.id} className="rounded-3xl border border-border bg-card p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  {b?.avatar_url ? (
                    <img src={b.avatar_url} alt={b.username} className="h-9 w-9 rounded-full object-cover" />
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-fire text-sm font-bold text-primary-foreground">
                      {(b?.display_name ?? "B").charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold">{b?.display_name ?? "Brand"}</p>
                    <p className="text-xs text-muted-foreground">@{b?.username ?? "brand"} · {timeAgo(c.created_at)}</p>
                  </div>
                </div>
                <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-semibold capitalize text-gold">{c.category}</span>
              </div>

              <h2 className="mt-3 font-display text-lg font-bold">{c.title}</h2>
              {c.description && <p className="mt-1 text-sm text-muted-foreground">{c.description}</p>}

              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
                <span className="flex items-center gap-1 font-semibold text-gold">
                  <Coins className="h-4 w-4" /> {compact(c.budget)} coins
                </span>
                {c.deadline && (
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="h-4 w-4" /> {new Date(c.deadline).toLocaleDateString()}
                  </span>
                )}
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Users className="h-4 w-4" /> {c.application_count} applied
                </span>
              </div>

              <Button
                onClick={() => (user ? setApplyTo(c) : navigate({ to: "/auth" }))}
                disabled={user?.id === c.brand_id}
                className="mt-4 w-full rounded-full bg-gradient-fire text-primary-foreground shadow-glow hover:opacity-90"
              >
                {user?.id === c.brand_id ? "Your campaign" : "Apply now"}
              </Button>
            </div>
          );
        })}
      </div>

      {applyTo && (
        <ApplyDialog
          campaign={applyTo}
          onClose={() => setApplyTo(null)}
          onApplied={() => {
            setApplyTo(null);
            qc.invalidateQueries({ queryKey: ["campaigns"] });
          }}
        />
      )}
      {showCreate && user && (
        <CreateDialog
          brandId={user.id}
          onClose={() => setShowCreate(false)}
          onCreated={() => {
            setShowCreate(false);
            qc.invalidateQueries({ queryKey: ["campaigns"] });
          }}
        />
      )}

      <BottomNav />
    </div>
  );
}

function ApplyDialog({ campaign, onClose, onApplied }: { campaign: Campaign; onClose: () => void; onApplied: () => void }) {
  const { user } = useAuth();
  const [pitch, setPitch] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!user) return;
    setBusy(true);
    const { error } = await supabase
      .from("campaign_applications")
      .insert({ campaign_id: campaign.id, creator_id: user.id, pitch: pitch.trim() });
    setBusy(false);
    if (error) {
      toast.error(error.message.includes("duplicate") ? "You already applied to this campaign." : error.message);
      return;
    }
    toast.success("Application sent!", { description: "The brand will review your pitch." });
    onApplied();
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="border-border bg-card">
        <DialogHeader>
          <DialogTitle className="font-display">Apply to “{campaign.title}”</DialogTitle>
          <DialogDescription>Tell the brand why you're the perfect creator for this campaign.</DialogDescription>
        </DialogHeader>
        <Textarea
          value={pitch}
          onChange={(e) => setPitch(e.target.value)}
          placeholder="Share your audience, ideas, and why this fits your style…"
          rows={5}
          maxLength={800}
          className="bg-secondary/40"
        />
        <DialogFooter>
          <Button
            onClick={submit}
            disabled={busy || !pitch.trim()}
            className="w-full rounded-full bg-gradient-fire text-primary-foreground shadow-glow hover:opacity-90"
          >
            Send application
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CreateDialog({ brandId, onClose, onCreated }: { brandId: string; onClose: () => void; onCreated: () => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [category, setCategory] = useState<Category>("lifestyle");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!title.trim()) return;
    setBusy(true);
    const { error } = await supabase.from("campaigns").insert({
      brand_id: brandId,
      title: title.trim(),
      description: description.trim(),
      budget: parseInt(budget || "0", 10) || 0,
      category,
      status: "active",
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Campaign posted!");
    onCreated();
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="border-border bg-card">
        <DialogHeader>
          <DialogTitle className="font-display">Post a campaign</DialogTitle>
          <DialogDescription>Find creators to make content for your brand.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Campaign title" maxLength={120} className="bg-secondary/40" />
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What are you looking for?" rows={3} maxLength={600} className="bg-secondary/40" />
          <Input value={budget} onChange={(e) => setBudget(e.target.value.replace(/\D/g, ""))} placeholder="Budget in coins" inputMode="numeric" className="bg-secondary/40" />
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-semibold capitalize transition-colors",
                  category === c ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground",
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={submit} disabled={busy || !title.trim()} className="w-full rounded-full bg-gradient-fire text-primary-foreground shadow-glow hover:opacity-90">
            Post campaign
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
