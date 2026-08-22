import { c as createServerRpc } from "./createServerRpc-CYVZPB7D.mjs";
import { a as createServerFn } from "./server-Dx3nuNLW.mjs";
import { c as createClient } from "../_libs/supabase__supabase-js.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
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
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
function createPublicClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    throw new Error("Missing Supabase public client env vars");
  }
  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}
const getPublicProfile_createServerFn_handler = createServerRpc({
  id: "4bf0d871c1b1448bf83ecae994053dfefc9592abecd0f940b98c0f46242944f0",
  name: "getPublicProfile",
  filename: "src/lib/profile.functions.ts"
}, (opts) => getPublicProfile.__executeServer(opts));
const getPublicProfile = createServerFn({
  method: "GET"
}).inputValidator((data) => data).handler(getPublicProfile_createServerFn_handler, async ({
  data
}) => {
  const supabase = createPublicClient();
  const {
    data: profile
  } = await supabase.from("profiles").select("*").eq("username", data.username).maybeSingle();
  if (!profile) return null;
  const [{
    count: followers
  }, {
    count: following
  }, {
    data: videos
  }] = await Promise.all([supabase.from("follows").select("*", {
    count: "exact",
    head: true
  }).eq("following_id", profile.id), supabase.from("follows").select("*", {
    count: "exact",
    head: true
  }).eq("follower_id", profile.id), supabase.from("videos").select("*").eq("creator_id", profile.id).eq("status", "published").order("created_at", {
    ascending: false
  })]);
  return {
    profile,
    followers: followers ?? 0,
    following: following ?? 0,
    videos: videos ?? []
  };
});
export {
  getPublicProfile_createServerFn_handler
};
