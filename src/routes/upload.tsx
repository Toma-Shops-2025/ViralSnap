import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import { Film, Loader2, Upload as UploadIcon, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { BottomNav } from "@/components/bottom-nav";
import { supabase } from "@/integrations/supabase/client";
import { createMuxDirectUpload, finalizeMuxUpload } from "@/lib/mux.functions";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/upload")({
  head: () => ({
    meta: [{ title: "Upload — ViralSnap" }],
  }),
  component: UploadPage,
});

function UploadPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [tags, setTags] = useState("");
  const [hasProduct, setHasProduct] = useState(false);
  const [productTitle, setProductTitle] = useState("");
  const [productUrl, setProductUrl] = useState("");
  const [productCta, setProductCta] = useState("Shop now");
  const [uploading, setUploading] = useState(false);
  const startMuxUpload = useServerFn(createMuxDirectUpload);
  const finalizeUpload = useServerFn(finalizeMuxUpload);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth", replace: true });
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!file) return setPreviewUrl(null);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const submit = async () => {
    if (!user || !file) return;
    setUploading(true);
    try {
      const tagList = tags
        .split(/[,\s]+/)
        .map((t) => t.replace(/^#/, "").trim())
        .filter(Boolean)
        .slice(0, 8);

      // 1. Create the video row in a processing state (no media URL yet).
      const { data: inserted, error: insErr } = await supabase
        .from("videos")
        .insert({
          creator_id: user.id,
          title: caption.slice(0, 80),
          caption,
          media_url: null,
          tags: tagList,
          status: "processing",
          mux_asset_status: "preparing",
          is_affiliate: hasProduct,
          product_title: hasProduct ? productTitle || null : null,
          product_url: hasProduct ? productUrl || null : null,
          product_cta: hasProduct ? productCta || null : null,
        })
        .select("id")
        .single();
      if (insErr || !inserted) throw insErr ?? new Error("Could not create post");

      // 2. Ask Mux for a one-time direct-upload URL linked to this row.
      const result = await startMuxUpload({ data: { videoId: inserted.id } });
      if ("error" in result) {
        // Clean up the orphaned row so it doesn't linger as processing.
        await supabase.from("videos").delete().eq("id", inserted.id);
        throw new Error(result.error);
      }

      // 3. Upload the raw file straight to Mux.
      const putRes = await fetch(result.uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type || "video/mp4" },
        body: file,
      });
      if (!putRes.ok) {
        await supabase.from("videos").delete().eq("id", inserted.id);
        throw new Error("Upload to Mux failed");
      }

      toast.success("Uploaded! 🔥 Your video is processing and will go live in a moment.");
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
        <span className="w-6" />
      </header>

      <div className="mx-auto max-w-md space-y-5 px-4 py-5">
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
          <Label htmlFor="tags">Tags</Label>
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

      <BottomNav />
    </div>
  );
}
