import { c as createServerRpc } from "./createServerRpc-CronfYHw.mjs";
import { a as createServerFn } from "./server-CauiqJuS.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-DPXRLhra.mjs";
import { a as assertContentAllowed } from "./content-policy-BiVAVm1B.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, a as arrayType, s as stringType } from "../_libs/zod.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "crypto";
import "../_libs/isbot.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
const isVideosBucketUrl = (u) => {
  try {
    const path = new URL(u).pathname;
    return path.includes("/storage/v1/object/public/videos/");
  } catch {
    return false;
  }
};
const publishVideo_createServerFn_handler = createServerRpc({
  id: "9dc2a96700ef0a093e0b587aaab6f32df94416bea3ce7e29c1cfb5bf14f68360",
  name: "publishVideo",
  filename: "src/lib/videos.functions.ts"
}, (opts) => publishVideo.__executeServer(opts));
const publishVideo = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  mediaUrl: stringType().url().refine(isVideosBucketUrl, "mediaUrl must point to the videos bucket"),
  coverUrl: stringType().url().refine((u) => {
    try {
      return new URL(u).pathname.includes("/storage/v1/object/public/covers/");
    } catch {
      return false;
    }
  }, "coverUrl must point to the covers bucket").nullish(),
  title: stringType().min(1).max(140),
  caption: stringType().max(2e3).optional(),
  tags: arrayType(stringType().min(1).max(40)).max(15).optional()
}).parse(input)).handler(publishVideo_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  let profile = null;
  const withBan = await supabase.from("profiles").select("username, display_name, is_banned").eq("id", userId).maybeSingle();
  if (withBan.error && /is_banned/i.test(withBan.error.message)) {
    const fallback = await supabase.from("profiles").select("username, display_name").eq("id", userId).maybeSingle();
    if (fallback.error) throw new Error(fallback.error.message);
    profile = fallback.data;
  } else if (withBan.error) {
    throw new Error(withBan.error.message);
  } else {
    profile = withBan.data;
  }
  if (profile?.is_banned) {
    throw new Error("This account is suspended for violating community guidelines.");
  }
  assertContentAllowed({
    username: profile?.username ?? void 0,
    displayName: profile?.display_name ?? void 0,
    title: data.title,
    caption: data.caption,
    tags: data.tags
  });
  const {
    data: video,
    error
  } = await supabase.from("videos").insert({
    id: crypto.randomUUID(),
    creator_id: userId,
    title: data.title,
    caption: data.caption?.trim() ?? "",
    media_url: data.mediaUrl,
    cover_url: data.coverUrl ?? null,
    tags: data.tags ?? [],
    status: "published"
  }).select("id").single();
  if (error) {
    const msg = error.message || "Could not publish video";
    if (/invalid api key/i.test(msg)) {
      throw new Error("Supabase rejected the server API key. In Netlify, set SUPABASE_PUBLISHABLE_KEY to the same anon key as VITE_SUPABASE_PUBLISHABLE_KEY, then redeploy.");
    }
    throw new Error(msg);
  }
  return {
    videoId: video.id
  };
});
export {
  publishVideo_createServerFn_handler
};
