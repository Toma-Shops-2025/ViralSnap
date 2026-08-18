import { useRef, useEffect } from "react";
import Hls from "hls.js";

interface VideoPlayerProps {
  url: string;
  poster?: string | null;
  isActive: boolean;
  isMuted: boolean;
  onToggleMute: () => void;
}

export function VideoPlayer({
  url,
  poster,
  isActive,
  isMuted,
  onToggleMute,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    if (!url) {
      el.removeAttribute("src");
      el.load();
      return;
    }

    let hls: Hls | null = null;
    let cancelled = false;

    const tryPlay = () => {
      if (cancelled || !isActive) return;
      el.play().catch((err) => {
        console.warn("Video play failed:", err);
      });
    };

    const pauseAndReset = () => {
      el.pause();
      el.currentTime = 0;
    };

    const isHls = url.endsWith(".m3u8");

    if (isHls && !el.canPlayType("application/vnd.apple.mpegurl") && Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource(url);
      hls.attachMedia(el);
      hls.on(Hls.Events.MANIFEST_PARSED, tryPlay);
      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) console.warn("HLS fatal error:", data);
      });
    } else {
      const onCanPlay = () => tryPlay();
      el.src = url;
      el.load();
      el.addEventListener("canplay", onCanPlay, { once: true });

      return () => {
        cancelled = true;
        el.removeEventListener("canplay", onCanPlay);
        hls?.destroy();
        pauseAndReset();
      };
    }

    if (!isActive) pauseAndReset();

    return () => {
      cancelled = true;
      hls?.destroy();
      pauseAndReset();
    };
  }, [url, isActive]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = isMuted;
  }, [isMuted]);

  return (
    <div className="relative h-full w-full bg-black flex items-center justify-center overflow-hidden">
      <video
        ref={videoRef}
        poster={poster ?? undefined}
        loop
        playsInline
        muted={isMuted}
        className="h-full w-full object-cover"
        onClick={onToggleMute}
      />
    </div>
  );
}
