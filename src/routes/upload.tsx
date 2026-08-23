import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useRef, useEffect, useMemo } from "react";
import {
  ArrowLeft,
  Film,
  Loader2,
  Sparkles,
  Upload as UploadIcon,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useProSubscription } from "@/hooks/use-pro";
import { publishVideo } from "@/lib/videos.functions";
import { generatePostContent } from "@/lib/pro.functions";
import { getStripeEnvironment } from "@/lib/stripe";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { toastErrorMessage } from "@/lib/utils";
import { assertContentAllowed } from "@/lib/content-policy";

export const Route = createFileRoute("/upload")({
  head: () => ({
    meta: [
      { title: "Post — ViralSnap" },
      { name: "description", content: "Upload a vertical video to the ViralSnap feed." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: UploadPage,
});

function UploadPage() {
  const { user, loading } = useAuth();
  const { isPro } = useProSubscription();
  const navigate = useNavigate();

  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [tags, setTags] = useState("");
  const [idea, setIdea] = useState("");
  const [genMetaLoading, setGenMetaLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [busyLabel, setBusyLabel] = useState("");
  const [progress, setProgress] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const preview = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/welcome", replace: true });
  }, [loading, user, navigate]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("video/")) {
      toast.error("Please select a video file");
      return;
    }
    if (f.size > (isPro ? 500 : 100) * 1024 * 1024) {
      toast.error(
        isPro
          ? "Video too large (max 500MB)"
          : "Video too large (max 100MB). Upgrade to Pro for more!",
      );
      return;
    }
    setFile(f);
  };

  const handleGenerateMeta = async () => {
    if (!isPro) {
      toast.error("AI captions are a ViralSnap Pro feature");
      navigate({ to: "/settings" });
      return;
    }
    const seed = idea.trim() || title.trim() || caption.trim();
    if (!seed) {
      toast.error("Type a quick idea or title first");
      return;
    }
    setGenMetaLoading(true);
    try {
      const meta = await generatePostContent({
        data: { idea: seed, environment: getStripeEnvironment() },
      });
      if ("error" in meta) {
        toast.error(toastErrorMessage(meta.error, "Could not generate caption"));
        return;
      }
      if (meta.titleOptions?.[0]) setTitle(meta.titleOptions[0]);
      if (meta.caption) setCaption(meta.caption);
      if (meta.hashtags?.length) {
        setTags(meta.hashtags.map((h) => `#${h}`).join(" "));
      }
      toast.success("Title, caption & hashtags generated");
    } catch (e) {
      toast.error(toastErrorMessage(e, "Could not generate caption"));
    } finally {
      setGenMetaLoading(false);
    }
  };

  const uploadVideoFile = async (videoFile: File): Promise<string> => {
    const ext = videoFile.name.split(".").pop() ?? "mp4";
    const path = `${user!.id}/${crypto.randomUUID()}.${ext}`;

    // Prefer the authenticated Supabase client (same keys as login) instead of a
    // separate XHR apikey header that can drift from Netlify VITE_ vars.
    const { error } = await supabase.storage.from("videos").upload(path, videoFile, {
      contentType: videoFile.type || "video/mp4",
      upsert: false,
    });

    if (error) {
      const msg = error.message || "Upload failed";
      if (/invalid api key/i.test(msg)) {
        throw new Error(
          "Supabase storage rejected the API key. Check VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in Netlify match your Supabase project anon key, then redeploy.",
        );
      }
      if (/maximum allowed size|exceeded/i.test(msg)) {
        throw new Error(
          "Upload exceeds storage size limit. In Supabase SQL Editor, run supabase/migrations/20260823120000_storage_videos_size_limit.sql, then try again.",
        );
      }
      throw new Error(msg);
    }

    setProgress(85);
    return supabase.storage.from("videos").getPublicUrl(path).data.publicUrl;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !user) return toast.error("Pick a video file");
    if (!title.trim()) return toast.error("Add a title");

    setBusy(true);
    setBusyLabel("Uploading…");
    setProgress(5);

    try {
      assertContentAllowed({
        title: title.trim(),
        caption: caption.trim(),
        tags: tags
          .split(/[,\s]+/)
          .map((t) => t.replace(/^#/, "").trim().toLowerCase())
          .filter(Boolean),
      });

      const mediaUrl = await uploadVideoFile(file);
      setProgress(90);
      setBusyLabel("Publishing…");

      const tagList = tags
        .split(/[,\s]+/)
        .map((t) => t.replace(/^#/, "").trim().toLowerCase())
        .filter(Boolean);

      await publishVideo({
        data: {
          mediaUrl,
          title: title.trim(),
          caption: caption.trim(),
          tags: tagList,
        },
      });

      setProgress(100);
      toast.success("Posted");
      navigate({ to: "/", replace: true });
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
      setBusyLabel("");
      setProgress(0);
    }
  };

  return (
    <div className="min-h-dvh bg-background">
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/80 px-4 py-3 backdrop-blur-xl pt-[calc(0.75rem+env(safe-area-inset-top))]">
        <button
          type="button"
          onClick={() => navigate({ to: -1 })}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-card"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="font-display text-xl tracking-tight text-gradient-gold">New post</h1>
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Video. Made to go viral.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-md px-5 pb-24 pt-6">
        <form onSubmit={submit} className="space-y-4">
          {!isPro && (
            <Link
              to="/settings"
              className="block rounded-md border border-gold/40 bg-gradient-to-r from-gold/10 to-transparent p-3 text-xs"
            >
              <span className="flex items-center gap-2 font-medium text-gold">
                <Sparkles className="h-3.5 w-3.5" /> Unlock AI features with Pro
              </span>
              <span className="mt-1 block text-muted-foreground">
                AI title, caption &amp; hashtags are Pro perks. Upgrade in Settings →
              </span>
            </Link>
          )}

          <label className="block cursor-pointer rounded-md border border-dashed border-border bg-card/40 p-4 hover:border-gold/40">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-md bg-background text-gold">
                {file ? <Film className="h-5 w-5" /> : <UploadIcon className="h-5 w-5" />}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-sm">Media (video)</div>
                <div className="truncate text-xs text-muted-foreground">
                  {file ? file.name : `Tap to choose a file · up to ${isPro ? "500MB" : "100MB"}`}
                </div>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              className="hidden"
              onChange={onFileChange}
            />
          </label>

          {preview && (
            <div className="overflow-hidden rounded-md border border-gold/20 bg-black">
              <video
                src={preview}
                className="mx-auto max-h-56 w-full object-contain"
                muted
                playsInline
                controls
              />
            </div>
          )}

          <Field label="Title">
            <input
              required
              maxLength={140}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title your video..."
              className="w-full rounded-md border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-gold/50"
            />
          </Field>

          <div className="space-y-2 rounded-md border border-gold/20 bg-card/30 p-3">
            <Field label="Quick idea (optional)">
              <input
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                maxLength={400}
                placeholder="e.g. funny cooking fail with grandma"
                className="w-full rounded-md border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-gold/50"
              />
            </Field>
            <button
              type="button"
              disabled={genMetaLoading}
              onClick={handleGenerateMeta}
              className="flex w-full items-center justify-center gap-2 rounded-md border border-gold/40 bg-card/40 px-3 py-2 text-xs uppercase tracking-[0.18em] text-gold hover:bg-card disabled:opacity-50"
            >
              {genMetaLoading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Sparkles className="h-3.5 w-3.5" />
              )}
              {genMetaLoading ? "Writing…" : "Generate title, caption & hashtags"}
            </button>
            <p className="text-[11px] text-muted-foreground">
              Type a short idea (or just a title) and let AI write the rest.
            </p>
          </div>

          <Field label="Caption">
            <textarea
              rows={3}
              maxLength={2000}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Add a description..."
              className="w-full resize-none rounded-md border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-gold/50"
            />
          </Field>

          <Field label="Hashtags">
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="#dance #funny #tutorial"
              className="w-full rounded-md border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-gold/50"
            />
          </Field>

          <div className="rounded-md border border-gold/20 bg-gold/5 p-3 text-[11px] leading-relaxed text-muted-foreground">
            By posting, you agree to our Content Policy. AI safety filters may review your video during processing.
          </div>

          <button
            disabled={busy || !file}
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-md bg-gradient-gold px-4 py-3 text-sm font-medium text-primary-foreground shadow-gold disabled:opacity-50"
          >
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            {busy ? (busyLabel || `Uploading… ${progress}%`) : "Publish to the feed"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}
