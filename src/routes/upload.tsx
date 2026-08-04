import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  Upload as UploadIcon,
  Video,
  X,
  Check,
  Loader2,
  Hash,
  Type,
  Music,
  MapPin,
  ChevronRight,
  Shield,
  Clock,
  Layout,
  Smartphone,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useProSubscription } from "@/hooks/use-pro";
import { createMuxDirectUpload, finalizeMuxUpload } from "@/lib/mux.functions";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/upload")({
  head: () => ({ meta: [{ title: "Upload — ViralSnap" }] }),
  component: UploadPage,
});

function UploadPage() {
  const { user, profile, loading } = useAuth();
  const { isPro } = useProSubscription();
  const navigate = useNavigate();

  const createUploadFn = createMuxDirectUpload;
  const finalizeFn = finalizeMuxUpload;

  const [step, setTab] = useState<"file" | "details" | "processing">("file");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [tags, setTags] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

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
    setPreview(URL.createObjectURL(f));
    setTab("details");
  };

  const handleUpload = async () => {
    if (!file || !user) return;
    setUploading(true);
    setTab("processing");

    try {
      // 1. Get upload URL from Mux (Server Fn)
      const res = await createUploadFn({ data: {}, context: { supabase, userId: user.id } });
      if ("error" in res) throw new Error(res.error);

      // 2. Upload file to Mux
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", res.url);
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          setProgress(Math.round((e.loaded / e.total) * 100));
        }
      };

      const uploadPromise = new Promise((resolve, reject) => {
        xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? resolve(null) : reject(new Error("Upload failed")));
        xhr.onerror = () => reject(new Error("Network error"));
      });

      xhr.send(file);
      await uploadPromise;

      // 3. Finalize on our side (Server Fn)
      const tagList = tags
        .split(/[,\s]+/)
        .map((t) => t.replace(/^#/, "").trim().toLowerCase())
        .filter(Boolean);

      await finalizeFn({
        data: {
          uploadId: res.id,
          title: title.trim(),
          caption: caption.trim(),
          tags: tagList,
        },
        context: { supabase, userId: user.id }
      });

      toast.success("Video uploaded! It will appear shortly.");
      navigate({ to: "/me", replace: true });
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Upload failed");
      setTab("details");
      setUploading(false);
      setProgress(0);
    }
  };

  if (step === "processing") {
    return (
      <div className="flex h-dvh flex-col items-center justify-center p-6 text-center">
        <div className="relative mb-8 h-32 w-32">
          <div className="absolute inset-0 animate-pulse rounded-full bg-primary/20" />
          <div className="absolute inset-4 rounded-full bg-card shadow-inner" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
          <svg className="absolute inset-0 h-full w-full -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="60"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-primary"
              strokeDasharray={2 * Math.PI * 60}
              style={{
                strokeDashoffset:
                  2 * Math.PI * 60 * (1 - (progress || 10) / 100),
                transition: "stroke-dashoffset 0.5s ease",
              }}
            />
          </svg>
        </div>
        <h2 className="font-display text-2xl font-bold">Uploading...</h2>
        <p className="mt-2 text-muted-foreground">
          {progress < 100
            ? `Sending your masterpiece to the cloud (${progress}%)`
            : "Finishing up and generating thumbnails..."}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-background">
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background/80 px-4 py-3 backdrop-blur-xl pt-[calc(0.75rem+env(safe-area-inset-top))]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => (step === "details" ? setTab("file") : navigate({ to: -1 }))}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-card"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="font-display text-lg font-bold">
            {step === "file" ? "New Video" : "Details"}
          </h1>
        </div>
        {step === "details" && (
          <button
            onClick={handleUpload}
            disabled={uploading || !title}
            className="rounded-full bg-primary px-5 py-1.5 text-sm font-bold text-primary-foreground shadow-glow disabled:opacity-50"
          >
            Post
          </button>
        )}
      </header>

      <div className="mx-auto max-w-md p-4">
        {step === "file" ? (
          <div className="space-y-6">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="group relative flex aspect-[3/4] cursor-pointer flex-col items-center justify-center rounded-[2.5rem] border-2 border-dashed border-border bg-card transition-all hover:border-primary/50 hover:bg-secondary/30"
            >
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="rounded-full bg-primary/10 p-5 group-hover:scale-110 transition-transform">
                  <UploadIcon className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <p className="text-lg font-bold">Choose a video</p>
                  <p className="mt-1 text-xs text-muted-foreground px-8">
                    Vertical videos (9:16) work best. Up to {isPro ? "500MB" : "100MB"}.
                  </p>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                className="hidden"
                onChange={onFileChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-border bg-card p-4">
                <Layout className="h-5 w-5 text-primary mb-2" />
                <p className="text-sm font-bold italic">Portrait</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-tight">Aspect Ratio 9:16</p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-4">
                <Smartphone className="h-5 w-5 text-primary mb-2" />
                <p className="text-sm font-bold italic">High Res</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-tight">Up to 4K Supported</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="relative aspect-[9/16] w-24 overflow-hidden rounded-xl border border-border bg-black shadow-lg">
                {preview && (
                  <video
                    src={preview}
                    className="h-full w-full object-cover opacity-60"
                    muted
                    playsInline
                  />
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    onClick={() => setTab("file")}
                    className="rounded-full bg-black/50 p-1.5 backdrop-blur"
                  >
                    <X className="h-4 w-4 text-white" />
                  </button>
                </div>
              </div>
              <div className="flex-1 space-y-3">
                <div className="relative">
                  <Type className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    autoFocus
                    placeholder="Title your video..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-xl border border-border bg-card py-2.5 pl-9 pr-3 text-sm font-medium outline-none focus:border-primary/50"
                  />
                </div>
                <textarea
                  placeholder="Add a description..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-primary/50 resize-none"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="flex items-center gap-2 px-1 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  <Hash className="h-3.5 w-3.5" /> Hashtags
                </label>
                <input
                  placeholder="#dance #funny #tutorial"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary/50"
                />
              </div>

              <div className="divide-y divide-border rounded-2xl border border-border bg-card overflow-hidden">
                <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-secondary/20 transition-colors">
                  <div className="flex items-center gap-3">
                    <Music className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm">Add Sound</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-secondary/20 transition-colors">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm">Location</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <div className="rounded-2xl border border-gold/20 bg-gold/5 p-4">
                <div className="flex items-start gap-3">
                  <Shield className="mt-0.5 h-4 w-4 text-gold" />
                  <div>
                    <p className="text-xs font-bold text-gold uppercase tracking-wider italic">Safety Check</p>
                    <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed">
                      By posting, you agree to our Content Policy. AI safety filters will review your video during processing.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
