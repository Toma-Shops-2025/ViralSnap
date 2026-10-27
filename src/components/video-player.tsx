import { useRef, useEffect } from "react";
import Hls from "hls.js";
import { PIP_REQUEST_EVENT } from "@/hooks/use-playback-preferences";

interface VideoPlayerProps {
  url: string;
  poster?: string | null;
  isActive: boolean;
  /** Load media only when near the viewport — keeps Android WebView from OOM. */
  isNear?: boolean;
  isMuted: boolean;
  volume?: number;
  onToggleMute: () => void;
  loop?: boolean;
  playbackRate?: number;
  onEnded?: () => void;
  /** When false, user must tap to start playback (e.g. Wi‑Fi only on cellular). */
  allowAutoplay?: boolean;
}

export function VideoPlayer({
  url,
  poster,
  isActive,
  isNear = false,
  isMuted,
  volume = 1,
  onToggleMute,
  loop = true,
  playbackRate = 1,
  onEnded,
  allowAutoplay = true,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const shouldLoad = isActive || isNear;

  // Attach / tear down media — only for the active card and its neighbors.
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    const tearDown = () => {
      hlsRef.current?.destroy();
      hlsRef.current = null;
      el.removeAttribute("src");
      el.load();
    };

    if (!shouldLoad || !url) {
      tearDown();
      return;
    }

    const isHls = url.endsWith(".m3u8");

    if (isHls && !el.canPlayType("application/vnd.apple.mpegurl") && Hls.isSupported()) {
      const hls = new Hls({
        maxBufferLength: 10,
        maxMaxBufferLength: 20,
        enableWorker: false,
      });
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
      tearDown();
    };
  }, [url, shouldLoad]);

  // Active scroll card — start from beginning when this video becomes active.
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    if (isActive && shouldLoad) {
      try {
        el.currentTime = 0;
      } catch {
        /* ignore */
      }
      el.muted = isMuted;
      el.volume = Math.min(1, Math.max(0, volume));
      if (allowAutoplay) {
        void el.play().catch((err) => {
          console.warn("Video play failed:", err);
        });
      } else {
        el.pause();
      }
    } else {
      el.pause();
      try {
        el.currentTime = 0;
      } catch {
        /* ignore */
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentionally omit mute/volume
  }, [isActive, url, shouldLoad, allowAutoplay]);

  useEffect(() => {
    const onPip = () => {
      const el = videoRef.current;
      if (!el || !isActive) return;
      const doc = document as Document & {
        pictureInPictureEnabled?: boolean;
      };
      if (!doc.pictureInPictureEnabled) return;
      void el.requestPictureInPicture().catch(() => {});
    };
    window.addEventListener(PIP_REQUEST_EVENT, onPip);
    return () => window.removeEventListener(PIP_REQUEST_EVENT, onPip);
  }, [isActive]);

  // Unmute / volume / speed — keep playback position.
  useEffect(() => {
    const el = videoRef.current;
    if (!el || !isActive) return;
    el.muted = isMuted;
    el.volume = Math.min(1, Math.max(0, volume));
    el.playbackRate = playbackRate;
    if (!isMuted) {
      void el.play().catch(() => {});
    }
  }, [isMuted, volume, playbackRate, isActive]);

  // Stop audio when user leaves the tab / minimizes the window.
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const onVisibility = () => {
      if (document.hidden) {
        el.pause();
      } else if (isActive && shouldLoad) {
        el.muted = isMuted;
        el.volume = Math.min(1, Math.max(0, volume));
        void el.play().catch(() => {});
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [isActive, isMuted, volume, shouldLoad]);

  return (
    <div className="relative h-full w-full bg-black flex items-center justify-center overflow-hidden">
      {poster && !shouldLoad && (
        <img src={poster} alt="" className="absolute inset-0 h-full w-full object-cover" />
      )}
      <video
        ref={videoRef}
        poster={poster ?? undefined}
        crossOrigin="anonymous"
        preload={shouldLoad ? "metadata" : "none"}
        loop={loop}
        playsInline
        muted={isMuted}
        className="h-full w-full object-cover"
        onEnded={() => {
          if (isActive) onEnded?.();
        }}
        onClick={() => {
          const el = videoRef.current;
          if (el?.paused && isActive) {
            void el.play().catch(() => {});
          }
          if (isMuted) onToggleMute();
        }}
      />
    </div>
  );
}
