import { supabaseAdmin } from "@/integrations/supabase/client.server";

const BUCKETS = ["avatars", "videos", "covers"] as const;

export async function restoreViralSnapPlayback() {
  const created: string[] = [];
  const existing: string[] = [];

  for (const id of BUCKETS) {
    const { data: bucket } = await supabaseAdmin.storage.getBucket(id);
    if (bucket) {
      existing.push(id);
      continue;
    }
    const { error } = await supabaseAdmin.storage.createBucket(id, { public: true });
    if (error && !/already exists/i.test(error.message)) {
      throw new Error(`Bucket ${id}: ${error.message}`);
    }
    created.push(id);
  }

  const { count: publishedBefore } = await supabaseAdmin
    .from("videos")
    .select("id", { count: "exact", head: true })
    .eq("status", "published");

  const { data: publishedRows, error: listErr } = await supabaseAdmin
    .from("videos")
    .select("id, media_url, mux_playback_id")
    .eq("status", "published");

  if (listErr) throw new Error(listErr.message);

  const legacyIds = (publishedRows ?? [])
    .filter((row) => {
      const url = row.media_url ?? "";
      const onCurrentStorage = url.includes(
        ".supabase.co/storage/v1/object/public/videos/",
      );
      return !onCurrentStorage;
    })
    .map((row) => row.id);

  let unpublishedLegacy = 0;
  if (legacyIds.length > 0) {
    const { error: hideErr } = await supabaseAdmin
      .from("videos")
      .update({ status: "removed" })
      .in("id", legacyIds);

    if (hideErr) throw new Error(hideErr.message);
    unpublishedLegacy = legacyIds.length;
  }

  const { count: publishedAfter } = await supabaseAdmin
    .from("videos")
    .select("id", { count: "exact", head: true })
    .eq("status", "published");

  return {
    buckets: { created, existing },
    publishedBefore: publishedBefore ?? 0,
    publishedAfter: publishedAfter ?? 0,
    unpublishedLegacy,
    note:
      "Unpublished legacy Mux/dead-URL rows. Feed now only shows Supabase Storage MP4 uploads.",
  };
}
