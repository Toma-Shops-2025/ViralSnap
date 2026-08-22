import { c as createServerRpc } from "./createServerRpc-CYVZPB7D.mjs";
import { a as createServerFn } from "./server-Dx3nuNLW.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-Co1FUz65.mjs";
import { s as supabase } from "./client-jZBAtL8Q.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, s as stringType, e as enumType } from "../_libs/zod.mjs";
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
const REPORT_REASONS = ["spam", "harassment", "hate", "sexual", "violence", "csam", "impersonation", "ip_violation", "self_harm", "illegal", "other"];
const submitReport_createServerFn_handler = createServerRpc({
  id: "10550da1dd81c3125cbe8efccc913114a86d2be9c39f4fa8d629540563305455",
  name: "submitReport",
  filename: "src/lib/safety.functions.ts"
}, (opts) => submitReport.__executeServer(opts));
const submitReport = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  targetType: enumType(["post", "comment", "user"]),
  targetId: stringType().uuid(),
  reason: enumType(REPORT_REASONS),
  details: stringType().max(1e3).optional()
}).parse(input)).handler(submitReport_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    error
  } = await supabase.from("reports").insert({
    reporter_id: context.userId,
    target_type: data.targetType,
    target_id: data.targetId,
    reason: data.reason,
    notes: data.details ?? null
  });
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const toggleBlock_createServerFn_handler = createServerRpc({
  id: "cd0be731928c8620a4ed002ddad5164e00790d9f214a0843964831bfee0483ca",
  name: "toggleBlock",
  filename: "src/lib/safety.functions.ts"
}, (opts) => toggleBlock.__executeServer(opts));
const toggleBlock = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  targetUserId: stringType().uuid()
}).parse(input)).handler(toggleBlock_createServerFn_handler, async ({
  data,
  context
}) => {
  if (data.targetUserId === context.userId) throw new Error("You can't block yourself");
  const {
    userId
  } = context;
  const {
    data: existing
  } = await supabase.from("blocks").select("blocker_id").eq("blocker_id", userId).eq("blocked_id", data.targetUserId).maybeSingle();
  if (existing) {
    await supabase.from("blocks").delete().eq("blocker_id", userId).eq("blocked_id", data.targetUserId);
    return {
      blocked: false
    };
  }
  await supabase.from("follows").delete().or(`and(follower_id.eq.${userId},following_id.eq.${data.targetUserId}),and(follower_id.eq.${data.targetUserId},following_id.eq.${userId})`);
  const {
    error
  } = await supabase.from("blocks").insert({
    blocker_id: userId,
    blocked_id: data.targetUserId
  });
  if (error) throw new Error(error.message);
  return {
    blocked: true
  };
});
export {
  submitReport_createServerFn_handler,
  toggleBlock_createServerFn_handler
};
