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
