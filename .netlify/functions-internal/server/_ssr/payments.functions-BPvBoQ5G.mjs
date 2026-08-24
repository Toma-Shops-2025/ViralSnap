import { c as createServerRpc } from "./createServerRpc-CronfYHw.mjs";
import { a as createServerFn } from "./server-CauiqJuS.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-DPXRLhra.mjs";
import { c as createStripeClient, g as getStripeErrorMessage } from "./stripe.server-DSl7M_sI.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import "../_libs/stripe.mjs";
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
import "events";
import "http";
import "https";
import "os";
const COIN_PACKS = {
  coins_500: 500,
  coins_1200: 1200,
  coins_3000: 3e3,
  coins_8000: 8e3
};
async function resolveOrCreateCustomer(stripe, options) {
  if (options.userId && !/^[a-zA-Z0-9_-]+$/.test(options.userId)) {
    throw new Error("Invalid userId");
  }
  if (options.userId) {
    const found = await stripe.customers.search({
      query: `metadata['userId']:'${options.userId}'`,
      limit: 1
    });
    if (found.data.length) return found.data[0].id;
  }
  if (options.email) {
    const existing = await stripe.customers.list({
      email: options.email,
      limit: 1
    });
    if (existing.data.length) {
      const customer = existing.data[0];
      if (options.userId && customer.metadata?.userId !== options.userId) {
        await stripe.customers.update(customer.id, {
          metadata: {
            ...customer.metadata,
            userId: options.userId
          }
        });
      }
      return customer.id;
    }
  }
  const created = await stripe.customers.create({
    ...options.email && {
      email: options.email
    },
    ...options.userId && {
      metadata: {
        userId: options.userId
      }
    }
  });
  return created.id;
}
const createCoinCheckoutSession_createServerFn_handler = createServerRpc({
  id: "4e35a6f023cbad3556b3f07b83cb6ff2c970244ecd1de8d9057b299a43d35d07",
  name: "createCoinCheckoutSession",
  filename: "src/lib/payments.functions.ts"
}, (opts) => createCoinCheckoutSession.__executeServer(opts));
const createCoinCheckoutSession = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => {
  if (!/^[a-zA-Z0-9_-]+$/.test(data.priceId)) throw new Error("Invalid priceId");
  if (!COIN_PACKS[data.priceId]) throw new Error("Unknown coin pack");
  return data;
}).handler(createCoinCheckoutSession_createServerFn_handler, async ({
  data,
  context
}) => {
  try {
    const userId = context.userId;
    const stripe = createStripeClient(data.environment);
    const coins = COIN_PACKS[data.priceId];
    const prices = await stripe.prices.list({
      lookup_keys: [data.priceId]
    });
    if (!prices.data.length) throw new Error("Price not found");
    const stripePrice = prices.data[0];
    const customerId = await resolveOrCreateCustomer(stripe, {
      email: data.customerEmail,
      userId
    });
    const productId = typeof stripePrice.product === "string" ? stripePrice.product : stripePrice.product.id;
    const product = await stripe.products.retrieve(productId);
    const session = await stripe.checkout.sessions.create({
      line_items: [{
        price: stripePrice.id,
        quantity: 1
      }],
      mode: "payment",
      ui_mode: "embedded_page",
      return_url: data.returnUrl,
      customer: customerId,
      // Full end-to-end compliance handling: Stripe calculates, collects,
      // files and remits tax, plus fraud/dispute/support coverage.
      // `managed_payments` is newer than the pinned SDK types, so cast.
      ...{
        managed_payments: {
          enabled: true
        }
      },
      payment_intent_data: {
        description: product.name
      },
      metadata: {
        userId,
        coins: String(coins),
        priceId: data.priceId,
        managed_payments: "true"
      }
    });
    return {
      clientSecret: session.client_secret ?? ""
    };
  } catch (error) {
    return {
      error: getStripeErrorMessage(error)
    };
  }
});
const SUPPORTER_MONTHLY_COINS = 350;
const SUPPORTER_PRICE_ID = "creator_supporter_monthly";
const createSupporterCheckoutSession_createServerFn_handler = createServerRpc({
  id: "f5773d22631e58cf635d034fc0a4b9746e3e9a9605327a9f9e0c570b89e6e998",
  name: "createSupporterCheckoutSession",
  filename: "src/lib/payments.functions.ts"
}, (opts) => createSupporterCheckoutSession.__executeServer(opts));
const createSupporterCheckoutSession = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => {
  if (!/^[0-9a-fA-F-]{36}$/.test(data.creatorId)) throw new Error("Invalid creator");
  return data;
}).handler(createSupporterCheckoutSession_createServerFn_handler, async ({
  data,
  context
}) => {
  try {
    const subscriberId = context.userId;
    if (subscriberId === data.creatorId) {
      return {
        error: "You can't subscribe to yourself."
      };
    }
    const stripe = createStripeClient(data.environment);
    const prices = await stripe.prices.list({
      lookup_keys: [SUPPORTER_PRICE_ID]
    });
    if (!prices.data.length) throw new Error("Subscription price not found");
    const stripePrice = prices.data[0];
    const customerId = await resolveOrCreateCustomer(stripe, {
      email: data.customerEmail,
      userId: subscriberId
    });
    const session = await stripe.checkout.sessions.create({
      line_items: [{
        price: stripePrice.id,
        quantity: 1
      }],
      mode: "subscription",
      ui_mode: "embedded_page",
      return_url: data.returnUrl,
      customer: customerId,
      ...{
        managed_payments: {
          enabled: true
        }
      },
      metadata: {
        userId: subscriberId,
        creatorId: data.creatorId,
        coins: String(SUPPORTER_MONTHLY_COINS),
        managed_payments: "true"
      },
      subscription_data: {
        metadata: {
          userId: subscriberId,
          creatorId: data.creatorId,
          coins: String(SUPPORTER_MONTHLY_COINS)
        }
      }
    });
    return {
      clientSecret: session.client_secret ?? ""
    };
  } catch (error) {
    return {
      error: getStripeErrorMessage(error)
    };
  }
});
const PRO_PRICE_ID = "pro_monthly";
const createProCheckoutSession_createServerFn_handler = createServerRpc({
  id: "8947aecc1f5347d4aa3aefc6be58f1a18577dda12d3fec64720f7a97b07ea33e",
  name: "createProCheckoutSession",
  filename: "src/lib/payments.functions.ts"
}, (opts) => createProCheckoutSession.__executeServer(opts));
const createProCheckoutSession = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => data).handler(createProCheckoutSession_createServerFn_handler, async ({
  data,
  context
}) => {
  try {
    const userId = context.userId;
    const stripe = createStripeClient(data.environment);
    const {
      data: existing
    } = await context.supabase.from("pro_subscriptions").select("status, current_period_end").eq("user_id", userId).eq("environment", data.environment).order("created_at", {
      ascending: false
    }).limit(1).maybeSingle();
    const stillActive = existing && (["active", "trialing"].includes(existing.status) || existing.status === "canceled" && existing.current_period_end && new Date(existing.current_period_end) > /* @__PURE__ */ new Date());
    if (stillActive) return {
      error: "You already have ViralSnap Pro."
    };
    const prices = await stripe.prices.list({
      lookup_keys: [PRO_PRICE_ID]
    });
    if (!prices.data.length) throw new Error("Pro price not found");
    const stripePrice = prices.data[0];
    const customerId = await resolveOrCreateCustomer(stripe, {
      email: data.customerEmail,
      userId
    });
    const session = await stripe.checkout.sessions.create({
      line_items: [{
        price: stripePrice.id,
        quantity: 1
      }],
      mode: "subscription",
      ui_mode: "embedded_page",
      return_url: data.returnUrl,
      customer: customerId,
      ...{
        managed_payments: {
          enabled: true
        }
      },
      metadata: {
        userId,
        plan: "pro",
        managed_payments: "true"
      },
      subscription_data: {
        metadata: {
          userId,
          plan: "pro"
        }
      }
    });
    return {
      clientSecret: session.client_secret ?? ""
    };
  } catch (error) {
    return {
      error: getStripeErrorMessage(error)
    };
  }
});
const createSubscriptionPortalSession_createServerFn_handler = createServerRpc({
  id: "38b65692770e1fe047c17704153cbfdd9a7a16c0e12139d5337085667a6b68b9",
  name: "createSubscriptionPortalSession",
  filename: "src/lib/payments.functions.ts"
}, (opts) => createSubscriptionPortalSession.__executeServer(opts));
const createSubscriptionPortalSession = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => data).handler(createSubscriptionPortalSession_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    data: proSub
  } = await supabase.from("pro_subscriptions").select("stripe_customer_id").eq("user_id", userId).eq("environment", data.environment).order("created_at", {
    ascending: false
  }).limit(1).maybeSingle();
  let customerId = proSub?.stripe_customer_id;
  if (!customerId) {
    const {
      data: sub2
    } = await supabase.from("creator_subscriptions").select("stripe_customer_id").eq("subscriber_id", userId).eq("environment", data.environment).order("created_at", {
      ascending: false
    }).limit(1).maybeSingle();
    customerId = sub2?.stripe_customer_id;
  }
  const sub = customerId ? {
    stripe_customer_id: customerId
  } : null;
  if (!sub?.stripe_customer_id) return {
    error: "No subscription found."
  };
  try {
    const stripe = createStripeClient(data.environment);
    const portal = await stripe.billingPortal.sessions.create({
      customer: sub.stripe_customer_id,
      ...data.returnUrl && {
        return_url: data.returnUrl
      }
    });
    return {
      url: portal.url
    };
  } catch (error) {
    return {
      error: getStripeErrorMessage(error)
    };
  }
});
export {
  createCoinCheckoutSession_createServerFn_handler,
  createProCheckoutSession_createServerFn_handler,
  createSubscriptionPortalSession_createServerFn_handler,
  createSupporterCheckoutSession_createServerFn_handler
};
