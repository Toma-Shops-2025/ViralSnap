import { d as createSsrRpc } from "./router-DDjFEyQJ.mjs";
import { a as createServerFn } from "./server-CauiqJuS.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-DPXRLhra.mjs";
const COIN_PACKS = {
  coins_500: 500,
  coins_1200: 1200,
  coins_3000: 3e3,
  coins_8000: 8e3
};
const createCoinCheckoutSession = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => {
  if (!/^[a-zA-Z0-9_-]+$/.test(data.priceId)) throw new Error("Invalid priceId");
  if (!COIN_PACKS[data.priceId]) throw new Error("Unknown coin pack");
  return data;
}).handler(createSsrRpc("4e35a6f023cbad3556b3f07b83cb6ff2c970244ecd1de8d9057b299a43d35d07"));
const createSupporterCheckoutSession = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => {
  if (!/^[0-9a-fA-F-]{36}$/.test(data.creatorId)) throw new Error("Invalid creator");
  return data;
}).handler(createSsrRpc("f5773d22631e58cf635d034fc0a4b9746e3e9a9605327a9f9e0c570b89e6e998"));
const createProCheckoutSession = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => data).handler(createSsrRpc("8947aecc1f5347d4aa3aefc6be58f1a18577dda12d3fec64720f7a97b07ea33e"));
const createSubscriptionPortalSession = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => data).handler(createSsrRpc("38b65692770e1fe047c17704153cbfdd9a7a16c0e12139d5337085667a6b68b9"));
export {
  createProCheckoutSession as a,
  createSubscriptionPortalSession as b,
  createCoinCheckoutSession as c,
  createSupporterCheckoutSession as d
};
