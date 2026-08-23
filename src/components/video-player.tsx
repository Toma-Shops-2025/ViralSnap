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
  const hlsRef = useRef<Hls | null>(null);

  // Attach / swap media source — never tied to mute/volume.
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    hlsRef.current?.destroy();
    hlsRef.current = null;

    if (!url) {
      el.removeAttribute("src");
      el.load();
      return;
    }

    const isHls = url.endsWith(".m3u8");

    if (isHls && !el.canPlayType("application/vnd.apple.mpegurl") && Hls.isSupported()) {
      const hls = new Hls();
      hlsRef.current = hls;
      hls.loadSource(url);
      hls.attachMedia(el);
      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) console.warn("HLS fatal error:", data);
      });
    } else {
      el.src = url;
      el.load();
    }

    return () => {
      hlsRef.current?.destroy();
      hlsRef.current = null;
    };
  }, [url]);

  // Active scroll card — start from beginning when this video becomes active.
  // Mute/volume must NOT be in this dependency list (TikTok-style).
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    if (isActive) {
      el.currentTime = 0;
      el.muted = isMuted;
      el.volume = Math.min(1, Math.max(0, volume));
      void el.play().catch((err) => {
        console.warn("Video play failed:", err);
      });
    } else {
      el.pause();
      el.currentTime = 0;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentionally omit mute/volume
  }, [isActive, url]);

  // Unmute / volume — keep playback position (same as AlgoRhythm).
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
