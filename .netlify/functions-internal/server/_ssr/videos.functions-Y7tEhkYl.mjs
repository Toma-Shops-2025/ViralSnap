import { c as createServerRpc } from "./createServerRpc-CYVZPB7D.mjs";
import { a as createServerFn } from "./server-Dx3nuNLW.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-Co1FUz65.mjs";
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
const STORAGE_BASE = `${process.env.SUPABASE_URL ?? ""}/storage/v1/object/public/`;
const isVideosBucketUrl = (u) => STORAGE_BASE !== "/storage/v1/object/public/" && u.startsWith(`${STORAGE_BASE}videos/`);
const publishVideo_createServerFn_handler = createServerRpc({
  id: "9dc2a96700ef0a093e0b587aaab6f32df94416bea3ce7e29c1cfb5bf14f68360",
  name: "publishVideo",
  filename: "src/lib/videos.functions.ts"
}, (opts) => publishVideo.__executeServer(opts));
const publishVideo = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  mediaUrl: stringType().url().refine(isVideosBucketUrl, "mediaUrl must point to the videos bucket"),
  coverUrl: stringType().url().refine((u) => STORAGE_BASE !== "/storage/v1/object/public/" && u.startsWith(`${STORAGE_BASE}covers/`), "coverUrl must point to the covers bucket").nullish(),
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
  const {
    data: video,
    error
  } = await supabase.from("videos").insert({
    creator_id: userId,
    title: data.title,
    caption: data.caption?.trim() ?? "",
    media_url: data.mediaUrl,
    cover_url: data.coverUrl ?? null,
    tags: data.tags ?? [],
    status: "published"
  }).select("id").single();
  if (error) throw new Error(error.message);
  return {
    videoId: video.id
  };
});
export {
  publishVideo_createServerFn_handler
};
