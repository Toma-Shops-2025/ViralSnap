import { useRef, useEffect } from "react";
import Hls from "hls.js";

interface VideoPlayerProps {
  url: string;
  poster?: string | null;
  isActive: boolean;
  isMuted: boolean;
  volume?: number;
  onToggleMute: () => void;
}

export function VideoPlayer({
  url,
  poster,
  isActive,
  isMuted,
  volume = 1,
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
      el.muted = isMuted;
      el.volume = Math.min(1, Math.max(0, volume));
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

      if (!isActive) pauseAndReset();

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
  }, [url, isActive, isMuted, volume]);

  // Unmute or scroll to new active video — play with sound immediately.
  useEffect(() => {
    const el = videoRef.current;
    if (!el || !isActive) return;
    el.muted = isMuted;
    el.volume = Math.min(1, Math.max(0, volume));
    if (!isMuted) {
      void el.play().catch(() => {});
    }
  }, [isMuted, volume, isActive]);

  // Stop audio when user leaves the tab / minimizes the window.
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const onVisibility = () => {
      if (document.hidden) {
        el.pause();
      } else if (isActive) {
        el.muted = isMuted;
        el.volume = Math.min(1, Math.max(0, volume));
        void el.play().catch(() => {});
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [isActive, isMuted, volume]);

  return (
    <div className="relative h-full w-full bg-black flex items-center justify-center overflow-hidden">
      <video
        ref={videoRef}
        poster={poster ?? undefined}
        crossOrigin="anonymous"
        preload="auto"
        loop
        playsInline
        muted={isMuted}
        className="h-full w-full object-cover"
        onClick={() => {
          if (isMuted) onToggleMute();
        }}
      />
    </div>
  );
}
