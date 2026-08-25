import { useEffect, useState } from "react";
import { getVideoPlaybackUrl, getVideoPosterUrl } from "@/lib/video";
import type { Tables } from "@/integrations/supabase/types";

type VideoLike = Partial<Tables<"videos">> & {
  media_url?: string | null;
  cover_url?: string | null;
};

/**
 * Grid thumbnail for Discover / Profile / Search.
 * Prefers cover_url (or Mux thumb). If missing, seeks the MP4 and paints a
 * JPEG frame so Android WebView doesn't show a blank gray tile.
 */
export function VideoGridThumb({
  video,
  alt,
  className = "h-full w-full object-cover",
}: {
  video: VideoLike;
  alt: string;
  className?: string;
}) {
  const poster = getVideoPosterUrl(video);
  const playback = getVideoPlaybackUrl(video as Pick<Tables<"videos">, "media_url"> & VideoLike);
  const [frameUrl, setFrameUrl] = useState<string | null>(poster);

  useEffect(() => {
    setFrameUrl(poster);
  }, [poster]);

  useEffect(() => {
    if (poster || !playback || playback.endsWith(".m3u8")) return;

    let cancelled = false;
    let objectUrl: string | null = null;
    const el = document.createElement("video");
    el.muted = true;
    el.defaultMuted = true;
    el.playsInline = true;
    el.preload = "auto";
    el.crossOrigin = "anonymous";
    el.src = playback;

    const cleanup = () => {
      el.removeAttribute("src");
      el.load();
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };

    const paint = () => {
      if (cancelled || !el.videoWidth) return;
      try {
        const canvas = document.createElement("canvas");
        const w = el.videoWidth;
        const h = el.videoHeight;
        canvas.width = Math.min(w, 540);
        canvas.height = Math.round((canvas.width / w) * h);
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(el, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(
          (blob) => {
            if (!blob || cancelled) return;
            if (objectUrl) URL.revokeObjectURL(objectUrl);
            objectUrl = URL.createObjectURL(blob);
            setFrameUrl(objectUrl);
          },
          "image/jpeg",
          0.82,
        );
      } catch {
        // Tainted canvas / CORS — leave fallback video visible via parent.
      }
    };

    const onMeta = () => {
      const t = Number.isFinite(el.duration) && el.duration > 0
        ? Math.min(0.35, el.duration * 0.08)
        : 0.1;
      try {
        el.currentTime = t;
      } catch {
        paint();
      }
    };

    el.addEventListener("loadeddata", onMeta);
    el.addEventListener("seeked", paint);
    el.addEventListener("error", () => undefined);

    return () => {
      cancelled = true;
      el.removeEventListener("loadeddata", onMeta);
      el.removeEventListener("seeked", paint);
      cleanup();
    };
  }, [poster, playback]);

  if (frameUrl) {
    return <img src={frameUrl} alt={alt} className={className} loading="lazy" />;
  }

  if (playback) {
    return (
      <video
        src={`${playback}#t=0.1`}
        muted
        playsInline
        preload="auto"
        className={className}
      />
    );
  }

  return <div className={`${className} bg-card`} aria-hidden />;
}
