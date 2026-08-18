import type { Tables } from "@/integrations/supabase/types";

type VideoRow = Tables<"videos">;

const LEGACY_SUPABASE_HOSTS = [
  "gmvpdlefvsafqrblbpfi.supabase.co",
  "goorydexknxspyetdnsi.supabase.co",
];

function rewriteLegacyStorageUrl(url: string): string {
  const current =
    import.meta.env.VITE_SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    "";
  const origin = current.split("/rest/v1")[0].replace(/\/$/, "");
  if (!origin || !url) return url;

  let resolved = url;
  for (const legacy of LEGACY_SUPABASE_HOSTS) {
    resolved = resolved.replaceAll(`https://${legacy}`, origin);
  }
  return resolved;
}

export function getVideoPlaybackUrl(
  video: Pick<VideoRow, "media_url"> & Partial<VideoRow>,
): string {
  const muxPlaybackId = "mux_playback_id" in video ? video.mux_playback_id : null;
  if (muxPlaybackId) {
    return `https://stream.mux.com/${muxPlaybackId}.m3u8`;
  }
  return rewriteLegacyStorageUrl(video.media_url ?? "");
}

export function getVideoPosterUrl(video: Partial<VideoRow>) {
  if (video.cover_url) return rewriteLegacyStorageUrl(video.cover_url);
  const muxPlaybackId = "mux_playback_id" in video ? video.mux_playback_id : null;
  if (muxPlaybackId) {
    return `https://image.mux.com/${muxPlaybackId}/thumbnail.jpg?time=0`;
  }
  return null;
}

export function getVideoAssetStatus(video: Partial<VideoRow>) {
  const status = "mux_asset_status" in video ? video.mux_asset_status : null;
  return status ?? "ready";
}

export function isAdaptiveStream(video: Partial<VideoRow>) {
  const playback = getVideoPlaybackUrl(video as Pick<VideoRow, "media_url"> & Partial<VideoRow>);
  return playback.endsWith(".m3u8");
}
