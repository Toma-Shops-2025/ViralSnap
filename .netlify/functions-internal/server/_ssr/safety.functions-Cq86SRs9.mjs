import { d as createSsrRpc } from "./router-DDjFEyQJ.mjs";
import { a as createServerFn } from "./server-CauiqJuS.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-DPXRLhra.mjs";
import { o as objectType, s as stringType, e as enumType } from "../_libs/zod.mjs";
const REPORT_REASONS = ["spam", "harassment", "hate", "sexual", "violence", "csam", "impersonation", "ip_violation", "self_harm", "illegal", "other"];
const submitReport = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  targetType: enumType(["post", "comment", "user"]),
  targetId: stringType().uuid(),
  reason: enumType(REPORT_REASONS),
  details: stringType().max(1e3).optional()
}).parse(input)).handler(createSsrRpc("10550da1dd81c3125cbe8efccc913114a86d2be9c39f4fa8d629540563305455"));
const toggleBlock = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  targetUserId: stringType().uuid()
}).parse(input)).handler(createSsrRpc("cd0be731928c8620a4ed002ddad5164e00790d9f214a0843964831bfee0483ca"));
export {
  submitReport as s,
  toggleBlock as t
};
