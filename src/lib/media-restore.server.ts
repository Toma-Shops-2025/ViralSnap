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

  const { error: hideErr } = await supabaseAdmin
    .from("videos")
    .update({ status: "removed" })
    .eq("status", "published")
    .is("mux_playback_id", null);

  if (hideErr) throw new Error(hideErr.message);

  const { count: publishedAfter } = await supabaseAdmin
    .from("videos")
    .select("id", { count: "exact", head: true })
    .eq("status", "published");

  return {
    buckets: { created, existing },
    publishedBefore: publishedBefore ?? 0,
    publishedAfter: publishedAfter ?? 0,
    note:
      "Storage policies still require restore-playback.sql if uploads fail. Re-upload videos to repopulate the feed.",
  };
}
