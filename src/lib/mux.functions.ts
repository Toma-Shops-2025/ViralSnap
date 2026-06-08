import { createServerFn } from "@tanstack/react-start";
import { getRequestHost } from "@tanstack/react-start/server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createDirectUpload, reconcileUpload } from "@/lib/mux.server";

/**
 * Creates a Mux direct-upload for a video the current user owns and records the
 * upload id on the row. Returns a one-time URL the browser uploads the file to.
 */
export const createMuxDirectUpload = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { videoId: string }) => {
    if (!/^[0-9a-fA-F-]{36}$/.test(data.videoId)) throw new Error("Invalid videoId");
    return data;
  })
  .handler(async ({ data, context }): Promise<{ uploadUrl: string } | { error: string }> => {
    const { supabase, userId } = context;

    // Confirm the caller owns the video row before issuing an upload.
    const { data: video, error: fetchErr } = await supabase
      .from("videos")
      .select("id, creator_id")
      .eq("id", data.videoId)
      .single();

    if (fetchErr || !video) return { error: "Video not found" };
    if (video.creator_id !== userId) return { error: "Not allowed" };

    try {
      const host = getRequestHost();
      const corsOrigin = host ? `https://${host}` : "*";
      const { uploadId, uploadUrl } = await createDirectUpload({
        passthrough: data.videoId,
        corsOrigin,
      });

      await supabase
        .from("videos")
        .update({ mux_upload_id: uploadId, mux_asset_status: "uploading" })
        .eq("id", data.videoId);

      return { uploadUrl };
    } catch (err) {
      console.error("Mux direct upload error:", err);
      return { error: "Could not start video upload" };
    }
  });

/**
 * Webhook-independent publish path. The owner's browser calls this after the
 * file finishes uploading; it asks Mux for the current asset state and, once
 * the asset is ready, flips the row to published with its playback id. Returns
 * the resolved status so the client can poll until it's no longer "processing".
 */
export const finalizeMuxUpload = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { videoId: string }) => {
    if (!/^[0-9a-fA-F-]{36}$/.test(data.videoId)) throw new Error("Invalid videoId");
    return data;
  })
  .handler(async ({ data, context }): Promise<{ status: string }> => {
    const { supabase, userId } = context;

    const { data: video } = await supabase
      .from("videos")
      .select("id, creator_id, mux_upload_id, status")
      .eq("id", data.videoId)
      .single();

    if (!video || video.creator_id !== userId) return { status: "not_found" };
    if (video.status === "published") return { status: "ready" };
    if (!video.mux_upload_id) return { status: "processing" };

    const result = await reconcileUpload(video.mux_upload_id);

    if (result.assetStatus === "ready" && result.playbackId) {
      await supabase
        .from("videos")
        .update({
          mux_asset_id: result.assetId,
          mux_playback_id: result.playbackId,
          mux_asset_status: "ready",
          status: "published",
        })
        .eq("id", data.videoId);
      return { status: "ready" };
    }

    if (result.assetStatus === "errored") {
      await supabase
        .from("videos")
        .update({ mux_asset_status: "errored", status: "errored" })
        .eq("id", data.videoId);
      return { status: "errored" };
    }

    return { status: "processing" };
  });

/**
 * Safety net for videos whose webhook never arrived and whose uploader closed
 * the tab before finalize finished. Reconciles recent "processing" rows against
 * Mux truth. Public + idempotent: it only ever copies state from Mux, so it is
 * safe to call on feed load.
 */
export const reconcileStuckVideos = createServerFn({ method: "POST" }).handler(
  async (): Promise<{ published: number }> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const since = new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString();
    const { data: rows } = await supabaseAdmin
      .from("videos")
      .select("id, mux_upload_id")
      .eq("status", "processing")
      .gte("created_at", since)
      .not("mux_upload_id", "is", null)
      .limit(25);

    if (!rows || rows.length === 0) return { published: 0 };

    let published = 0;
    for (const row of rows) {
      if (!row.mux_upload_id) continue;
      const result = await reconcileUpload(row.mux_upload_id);
      if (result.assetStatus === "ready" && result.playbackId) {
        await supabaseAdmin
          .from("videos")
          .update({
            mux_asset_id: result.assetId,
            mux_playback_id: result.playbackId,
            mux_asset_status: "ready",
            status: "published",
          })
          .eq("id", row.id);
        published += 1;
      } else if (result.assetStatus === "errored") {
        await supabaseAdmin
          .from("videos")
          .update({ mux_asset_status: "errored", status: "errored" })
          .eq("id", row.id);
      }
    }
    return { published };
  },
);
