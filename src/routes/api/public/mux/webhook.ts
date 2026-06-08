import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { verifyMuxSignature } from "@/lib/mux.server";

type MuxAsset = {
  id?: string;
  passthrough?: string;
  upload_id?: string;
  playback_ids?: { id: string; policy: string }[];
};

type MuxEvent = {
  type: string;
  data: MuxAsset;
};

async function handleEvent(event: MuxEvent) {
  const asset = event.data ?? {};
  const videoId = asset.passthrough;

  switch (event.type) {
    case "video.asset.ready": {
      if (!videoId) return;
      const playbackId = asset.playback_ids?.find((p) => p.policy === "public")?.id
        ?? asset.playback_ids?.[0]?.id
        ?? null;
      await supabaseAdmin
        .from("videos")
        .update({
          mux_asset_id: asset.id ?? null,
          mux_playback_id: playbackId,
          mux_asset_status: "ready",
          status: "published",
        })
        .eq("id", videoId);
      break;
    }
    case "video.asset.errored": {
      if (!videoId) return;
      await supabaseAdmin
        .from("videos")
        .update({ mux_asset_status: "errored", status: "errored" })
        .eq("id", videoId);
      break;
    }
    case "video.upload.cancelled":
    case "video.upload.errored": {
      // Linked via the upload id we stored when creating the upload.
      const uploadId = asset.id ?? asset.upload_id;
      if (!uploadId) return;
      await supabaseAdmin
        .from("videos")
        .update({ mux_asset_status: "errored", status: "errored" })
        .eq("mux_upload_id", uploadId);
      break;
    }
    default:
      // Other events (asset.created, upload.asset_created, etc.) need no action.
      break;
  }
}

export const Route = createFileRoute("/api/public/mux/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = await request.text();
        const signature = request.headers.get("mux-signature");

        const valid = await verifyMuxSignature(body, signature);
        if (!valid) {
          return new Response("Invalid signature", { status: 401 });
        }

        try {
          await handleEvent(JSON.parse(body) as MuxEvent);
          return Response.json({ received: true });
        } catch (e) {
          console.error("Mux webhook error:", e);
          return new Response("Webhook error", { status: 400 });
        }
      },
    },
  },
});
