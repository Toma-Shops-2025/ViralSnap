import { S as Stripe } from "../_libs/stripe.mjs";
const getEnv = (key) => {
  const value = process.env[key];
  if (!value) throw new Error(`${key} is not configured`);
  return value;
};
function getStripeSecretKey(env) {
  if (env === "sandbox") {
    return process.env.STRIPE_SANDBOX_API_KEY || process.env.STRIPE_SECRET_KEY_TEST || getEnv("STRIPE_SANDBOX_API_KEY");
  }
  return process.env.STRIPE_LIVE_API_KEY || process.env.STRIPE_SECRET_KEY_LIVE || getEnv("STRIPE_LIVE_API_KEY");
}
function createStripeClient(env) {
  return new Stripe(getStripeSecretKey(env), {
    apiVersion: "2026-03-25.dahlia",
    httpClient: Stripe.createFetchHttpClient()
  });
}
function getStripeErrorMessage(error) {
  if (error && typeof error === "object") {
    const stripeError = error;
    const message = stripeError.raw?.message ?? stripeError.message;
    if (message) {
      const details = [
        stripeError.raw?.type ?? stripeError.type,
        stripeError.raw?.code ?? stripeError.code,
        stripeError.raw?.decline_code ?? stripeError.decline_code,
        stripeError.raw?.param ?? stripeError.param,
        stripeError.raw?.requestId ?? stripeError.requestId
      ].filter(Boolean);
      return details.length ? `${message} (${details.join(", ")})` : message;
    }
  }
  return "Stripe request failed";
}
async function verifyWebhook(req, env) {
  const signature = req.headers.get("stripe-signature");
  const body = await req.text();
  const secret = env === "sandbox" ? getEnv("PAYMENTS_SANDBOX_WEBHOOK_SECRET") : getEnv("PAYMENTS_LIVE_WEBHOOK_SECRET");
  if (!signature || !body) {
    throw new Error("Missing signature or body");
  }
  let timestamp;
  const v1Signatures = [];
  for (const part of signature.split(",")) {
    const [key2, value] = part.split("=", 2);
    if (key2 === "t") timestamp = value;
    if (key2 === "v1") v1Signatures.push(value);
  }
  if (!timestamp || v1Signatures.length === 0) {
    throw new Error("Invalid signature format");
  }
  const age = Math.abs(Date.now() / 1e3 - Number(timestamp));
  if (age > 300) {
    throw new Error("Webhook timestamp too old");
  }
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signed = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(`${timestamp}.${body}`)
  );
  const expected = Buffer.from(new Uint8Array(signed)).toString("hex");
  if (!v1Signatures.includes(expected)) {
    throw new Error("Invalid webhook signature");
  }
  return JSON.parse(body);
}
export {
  createStripeClient as c,
  getStripeErrorMessage as g,
  verifyWebhook as v
};
