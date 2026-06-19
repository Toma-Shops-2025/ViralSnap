import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import { Film, Loader2, Sparkles, Upload as UploadIcon, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BottomNav } from "@/components/bottom-nav";
import { supabase } from "@/integrations/supabase/client";
import { generatePostContent } from "@/lib/pro.functions";
import { getStripeEnvironment } from "@/lib/stripe";
import { useAuth } from "@/hooks/use-auth";
import { useProSubscription } from "@/hooks/use-pro";
import { useStripeCheckout } from "@/hooks/useStripeCheckout";

export const Route = createFileRoute("/upload")({
  head: () => ({
    meta: [{ title: "Upload — ViralSnap" }],
  }),
  component: UploadPage,
});

function UploadPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { isPro, refetch: refetchPro } = useProSubscription();
  const { openCheckout, closeCheckout, isOpen, checkoutElement } = useStripeCheckout();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [idea, setIdea] = useState("");
  const [caption, setCaption] = useState("");
  const [tags, setTags] = useState("");
  const [titleOptions, setTitleOptions] = useState<string[]>([]);
  const [hook, setHook] = useState("");
  const [postingTip, setPostingTip] = useState("");
  const [generating, setGenerating] = useState(false);
  const [hasProduct, setHasProduct] = useState(false);
  const [productTitle, setProductTitle] = useState("");
  const [productUrl, setProductUrl] = useState("");
  const [productCta, setProductCta] = useState("Shop now");
  const [uploading, setUploading] = useState(false);
  const generate = useServerFn(generatePostContent);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth", replace: true });
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!file) return setPreviewUrl(null);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const upgradeToPro = () => {
    if (!user) return navigate({ to: "/auth" });
    openCheckout({
      plan: "pro",
      userId: user.id,
      customerEmail: user.email ?? undefined,
      returnUrl: `${window.location.origin}/upload?pro=success`,
    });
  };

  const handleGenerate = async () => {
    if (!user) return navigate({ to: "/auth" });
    if (!isPro) return upgradeToPro();
    if (idea.trim().length < 2) {
      toast.error("Type a short idea first");
      return;
    }
    setGenerating(true);
    try {
      const res = await generate({
        data: { idea: idea.trim(), environment: getStripeEnvironment() },
      });
      if ("error" in res) throw new Error(res.error);
      setTitleOptions(res.titleOptions);
      setTitle(res.titleOptions[0] ?? "");
      setCaption(res.caption);
      if (res.hashtags.length) setTags(res.hashtags.join(" "));
      setHook(res.hook);
      setPostingTip(res.postingTip);
      toast.success("Generated ✨");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setGenerating(false);
    }
  };

  const submit = async () => {
    if (!user || !file) return;
    setUploading(true);
    try {
      const tagList = tags
        .split(/[,\s]+/)
        .map((t) => t.replace(/^#/, "").trim())
        .filter(Boolean)
        .slice(0, 8);

      const finalTitle = (title.trim() || caption.slice(0, 80)).slice(0, 80);

      // 1. Grab a poster frame + duration from the chosen file (best-effort).
      const meta = await captureVideoPoster(file).catch(() => null);

      // 2. Upload the raw video straight to Cloud Storage — no external host,
      //    no encoding queue, so it's live the moment the upload finishes.
      const ext = (file.name.split(".").pop() || "mp4").toLowerCase().replace(/[^a-z0-9]/g, "");
      const mediaPath = `${user.id}/${crypto.randomUUID()}.${ext || "mp4"}`;
      const { error: upErr } = await supabase.storage
        .from("videos")
        .upload(mediaPath, file, {
          contentType: file.type || "video/mp4",
          upsert: false,
        });
      if (upErr) throw new Error(upErr.message);
      const mediaUrl = supabase.storage.from("videos").getPublicUrl(mediaPath).data.publicUrl;

      // 3. Upload the poster to the covers bucket (optional, for a clean first frame).
      let coverUrl: string | null = null;
      if (meta?.posterBlob) {
        const coverPath = `${user.id}/${crypto.randomUUID()}.jpg`;
        const { error: covErr } = await supabase.storage
          .from("covers")
          .upload(coverPath, meta.posterBlob, { contentType: "image/jpeg", upsert: false });
        if (!covErr) {
          coverUrl = supabase.storage.from("covers").getPublicUrl(coverPath).data.publicUrl;
        }
      }

      // 4. Create the post — published instantly, plays directly from storage.
      const { error: insErr } = await supabase.from("videos").insert({
        creator_id: user.id,
        title: finalTitle,
        caption,
        media_url: mediaUrl,
        cover_url: coverUrl,
        duration: meta?.duration ?? 0,
        tags: tagList,
        status: "published",
        is_affiliate: hasProduct,
        product_title: hasProduct ? productTitle || null : null,
        product_url: hasProduct ? productUrl || null : null,
        product_cta: hasProduct ? productCta || null : null,
      });
      if (insErr) throw new Error(insErr.message);

      toast.success("Posted! 🔥 Your video is live.");
      navigate({ to: "/" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] pb-28">
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background/80 px-4 py-3 backdrop-blur-xl pt-[calc(0.75rem+env(safe-area-inset-top))]">
        <Link to="/" className="text-muted-foreground">
          <X className="h-6 w-6" />
        </Link>
        <h1 className="font-display text-lg font-bold">New post</h1>
        {isPro ? (
          <span className="rounded-full bg-gradient-fire px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary-foreground shadow-glow">
            Pro
          </span>
        ) : (
          <span className="w-6" />
        )}
      </header>

      <div className="mx-auto max-w-md space-y-5 px-4 py-5">
        {!isPro && (
          <button
            onClick={upgradeToPro}
            className="w-full rounded-2xl border border-primary/30 bg-primary/5 p-4 text-left"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 shrink-0 text-primary" />
              <p className="font-semibold text-primary">
                Go Pro — supercharge every post
              </p>
            </div>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li>✨ AI title, caption & hashtag generator</li>
              <li>🎯 3 title options to pick from, every time</li>
              <li>🪝 Scroll-stopping hook + best-time-to-post tips</li>
              <li>🏅 Pro badge on your profile</li>
              <li>🚀 Priority access to new features</li>
            </ul>
            <p className="mt-3 text-sm font-semibold text-primary">
              Just $4.99/mo — Upgrade →
            </p>
          </button>
        )}

        {!previewUrl ? (
          <button
            onClick={() => inputRef.current?.click()}
            className="flex aspect-[9/12] w-full flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-border bg-card text-muted-foreground"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-fire shadow-glow">
              <Film className="h-8 w-8 text-primary-foreground" />
            </div>
            <span className="font-medium text-foreground">Select a video</span>
            <span className="text-xs">MP4, MOV · up to ~100MB</span>
          </button>
        ) : (
          <div className="relative mx-auto aspect-[9/12] w-full overflow-hidden rounded-3xl bg-black">
            <video src={previewUrl} className="h-full w-full object-cover" controls />
            <button
              onClick={() => setFile(null)}
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="video/*"
          hidden
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />

        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="A scroll-stopping title"
            className="mt-1 rounded-xl bg-card"
          />
        </div>

        {/* AI generator — Pro perk */}
        <div className="rounded-2xl border border-border bg-card p-4">
          <Label htmlFor="idea" className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-primary" /> Quick idea (optional)
          </Label>
          <Input
            id="idea"
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="e.g. dreamy late-night drive synthwave"
            className="mt-2 rounded-xl bg-secondary"
          />
          <Button
            onClick={handleGenerate}
            disabled={generating}
            variant="outline"
            className="mt-3 w-full rounded-xl border-primary/40 text-primary hover:bg-primary/10"
          >
            {generating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Generating…
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" /> Generate title, caption & hashtags
              </>
            )}
          </Button>
          <p className="mt-2 text-xs text-muted-foreground">
            Type a short idea (or just a title) and let AI write the rest.
            {!isPro && " Pro only."}
          </p>

          {titleOptions.length > 1 && (
            <div className="mt-4 space-y-2">
              <p className="text-xs font-medium text-muted-foreground">
                Title options — tap to use
              </p>
              <div className="flex flex-wrap gap-2">
                {titleOptions.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => setTitle(opt)}
                    className={
                      "rounded-full border px-3 py-1.5 text-left text-xs transition-colors " +
                      (title === opt
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-secondary text-foreground hover:border-primary/40")
                    }
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {(hook || postingTip) && (
            <div className="mt-4 space-y-2 rounded-xl bg-secondary/60 p-3">
              {hook && (
                <p className="text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">🪝 Hook:</span> {hook}
                </p>
              )}
              {postingTip && (
                <p className="text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">🚀 Tip:</span>{" "}
                  {postingTip}
                </p>
              )}
            </div>
          )}
        </div>

        <div>
          <Label htmlFor="caption">Caption</Label>
          <Textarea
            id="caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Say something that hooks them in 3 seconds…"
            className="mt-1 rounded-xl bg-card"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="tags">Hashtags</Label>
          <Input
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="fyp, viral, howto"
            className="mt-1 rounded-xl bg-card"
          />
        </div>

        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Sell a product</p>
              <p className="text-xs text-muted-foreground">Add a shoppable link in-feed</p>
            </div>
            <Switch checked={hasProduct} onCheckedChange={setHasProduct} />
          </div>
          {hasProduct && (
            <div className="mt-4 space-y-3">
              <Input
                value={productTitle}
                onChange={(e) => setProductTitle(e.target.value)}
                placeholder="Product name"
                className="rounded-xl bg-secondary"
              />
              <Input
                value={productUrl}
                onChange={(e) => setProductUrl(e.target.value)}
                placeholder="https://yourstore.com/product"
                className="rounded-xl bg-secondary"
              />
              <Input
                value={productCta}
                onChange={(e) => setProductCta(e.target.value)}
                placeholder="Button text"
                className="rounded-xl bg-secondary"
              />
            </div>
          )}
        </div>

        <Button
          onClick={submit}
          disabled={!file || uploading}
          className="w-full rounded-full bg-gradient-fire py-6 text-base font-semibold text-primary-foreground shadow-glow hover:opacity-90"
        >
          {uploading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" /> Posting…
            </>
          ) : (
            <>
              <UploadIcon className="h-5 w-5" /> Post video
            </>
          )}
        </Button>
      </div>

      <Dialog
        open={isOpen}
        onOpenChange={(o) => {
          if (!o) {
            closeCheckout();
            refetchPro();
          }
        }}
      >
        <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upgrade to ViralSnap Pro</DialogTitle>
          </DialogHeader>
          {checkoutElement}
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
}
