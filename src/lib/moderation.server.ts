import { supabaseAdmin } from "@/integrations/supabase/client.server";

async function removeUserStorage(userId: string) {
  for (const bucket of ["videos", "covers", "avatars"] as const) {
    const { data: files } = await supabaseAdmin.storage.from(bucket).list(userId);
    if (!files?.length) continue;
    await supabaseAdmin.storage.from(bucket).remove(files.map((f) => `${userId}/${f.name}`));
  }
}

export async function takedownUserByUsername(username: string, reason = "policy violation") {
  const { data: profile, error } = await supabaseAdmin
    .from("profiles")
    .select("id, username")
    .eq("username", username.replace(/^@/, "").trim().toLowerCase())
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!profile) throw new Error(`User @${username} not found`);
  return takedownUserById(profile.id, reason);
}

export async function takedownUserById(
  userId: string,
  reason = "policy violation",
  deleteAccount = true,
) {
  const { data: videos, error: listErr } = await supabaseAdmin
    .from("videos")
    .select("id")
    .eq("creator_id", userId);

  if (listErr) throw new Error(listErr.message);

  const { error: hideErr } = await supabaseAdmin
    .from("videos")
    .update({ status: "removed" })
    .eq("creator_id", userId);

  if (hideErr) throw new Error(hideErr.message);

  const { error: banErr } = await supabaseAdmin
    .from("profiles")
    .update({
      is_banned: true,
      banned_at: new Date().toISOString(),
      ban_reason: reason,
    })
    .eq("id", userId);

  if (banErr) throw new Error(banErr.message);

  try {
    await removeUserStorage(userId);
  } catch (e) {
    console.warn("Storage cleanup failed for", userId, e);
  }

  let accountDeleted = false;
  if (deleteAccount) {
    const { error: delErr } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (delErr) throw new Error(delErr.message);
    accountDeleted = true;
  }

  return {
    userId,
    videosRemoved: videos?.length ?? 0,
    accountDeleted,
  };
}
