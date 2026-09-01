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

type SampleBrand = {
  display_name: string;
  username: string;
};

type DisplayCampaign = Campaign & {
  isSample?: boolean;
  sampleBrand?: SampleBrand;
};

const SAMPLE_CAMPAIGNS: DisplayCampaign[] = [
  {
    id: "sample-fashion-1",
    brand_id: "sample",
    title: "Summer Lookbook Reels",
    description: "Create 3 short reels showcasing our new summer collection. Tag @glowskin and use #GlowSummer.",
    budget: 2500,
    category: "fashion",
    status: "active",
    application_count: 18,
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 21).toISOString(),
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    isSample: true,
    sampleBrand: { display_name: "GlowSkin Co.", username: "glowskin" },
  },
  {
    id: "sample-beauty-1",
    brand_id: "sample",
    title: "Morning Skincare Routine UGC",
    description: "Film an authentic 30–60s get-ready clip featuring our vitamin C serum. Natural lighting preferred.",
    budget: 5000,
    category: "beauty",
    status: "active",
    application_count: 42,
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString(),
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    isSample: true,
    sampleBrand: { display_name: "Luma Beauty", username: "lumabeauty" },
  },
  {
    id: "sample-tech-1",
    brand_id: "sample",
    title: "Wireless Earbuds Unboxing",
    description: "Unbox and demo our new earbuds in a punchy vertical short. Highlight battery life and fit.",
    budget: 8000,
    category: "tech",
    status: "active",
    application_count: 31,
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 28).toISOString(),
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    isSample: true,
    sampleBrand: { display_name: "Pulse Audio", username: "pulseaudio" },
  },
  {
    id: "sample-food-1",
    brand_id: "sample",
    title: "Restaurant POV Taste Test",
    description: "Visit any participating location and film a POV tasting video. Show the vibe and your honest reaction.",
    budget: 3500,
    category: "food",
    status: "active",
    application_count: 27,
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10).toISOString(),
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    isSample: true,
    sampleBrand: { display_name: "Crave Kitchen", username: "cravekitchen" },
  },
];

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
  const realCampaigns = (data?.campaigns ?? []).filter((c) => filter === "all" || c.category === filter);
  const sampleCampaigns = SAMPLE_CAMPAIGNS.filter((c) => filter === "all" || c.category === filter);
  const campaigns: DisplayCampaign[] = [...realCampaigns, ...sampleCampaigns];

  return (
    <div className="min-h-[100dvh] pb-28">
      <header className="sticky top-0 z-30 space-y-3 border-b border-border bg-background/80 px-4 py-3 backdrop-blur-xl pt-[calc(0.75rem+env(safe-area-inset-top))]">
        <div className="flex items-center justify-between">
          <h1 className="flex items-center gap-2 font-display text-2xl font-bold">
            <Briefcase className="h-6 w-6 text-primary" /> Campaigns
          </h1>
          <button
            onClick={() => (user ? setShowCreate(true) : navigate({ to: "/welcome" }))}
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
          const b = c.isSample
            ? c.sampleBrand
            : data?.brands.get(c.brand_id);
          return (
            <div
              key={c.id}
              className={cn(
                "rounded-3xl border border-border bg-card p-4",
                c.isSample && "border-dashed border-muted-foreground/30",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  {!c.isSample && (b as { avatar_url?: string } | undefined)?.avatar_url ? (
                    <img src={(b as { avatar_url: string }).avatar_url} alt={(b as { username?: string }).username} className="h-9 w-9 rounded-full object-cover" />
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
                <div className="flex flex-col items-end gap-1">
                  {c.isSample && (
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Sample
                    </span>
                  )}
                  <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-semibold capitalize text-gold">{c.category}</span>
                </div>
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
                onClick={() => {
                  if (c.isSample) {
                    toast.info("Sample campaign", {
                      description: "Real brand deals from verified partners will appear here.",
                    });
                    return;
                  }
                  user ? setApplyTo(c) : navigate({ to: "/welcome" });
                }}
                disabled={!c.isSample && user?.id === c.brand_id}
                className="mt-4 w-full rounded-full bg-gradient-fire text-primary-foreground shadow-glow hover:opacity-90"
              >
                {c.isSample ? "Sample preview" : user?.id === c.brand_id ? "Your campaign" : "Apply now"}
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
