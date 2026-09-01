import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  type StripeEnv,
  createStripeClient,
  getStripeErrorMessage,
} from "@/lib/stripe.server";

type CheckoutSessionResult = { clientSecret: string } | { error: string };

// Maps human-readable coin pack price IDs to the number of coins granted.
const COIN_PACKS: Record<string, number> = {
  coins_500: 500,
  coins_1200: 1200,
  coins_3000: 3000,
  coins_8000: 8000,
};

async function resolveOrCreateCustomer(
  stripe: ReturnType<typeof createStripeClient>,
  options: { email?: string; userId?: string },
): Promise<string> {
  if (options.userId && !/^[a-zA-Z0-9_-]+$/.test(options.userId)) {
    throw new Error("Invalid userId");
  }
  if (options.userId) {
    const found = await stripe.customers.search({
      query: `metadata['userId']:'${options.userId}'`,
      limit: 1,
    });
    if (found.data.length) return found.data[0].id;
  }
  if (options.email) {
    const existing = await stripe.customers.list({ email: options.email, limit: 1 });
    if (existing.data.length) {
      const customer = existing.data[0];
      if (options.userId && customer.metadata?.userId !== options.userId) {
        await stripe.customers.update(customer.id, {
          metadata: { ...customer.metadata, userId: options.userId },
        });
      }
      return customer.id;
    }
  }
  const created = await stripe.customers.create({
    ...(options.email && { email: options.email }),
    ...(options.userId && { metadata: { userId: options.userId } }),
  });
  return created.id;
}

export const createCoinCheckoutSession = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (data: {
      priceId: string;
      customerEmail?: string;
      userId?: string;
      returnUrl: string;
      environment: StripeEnv;
    }) => {
      if (!/^[a-zA-Z0-9_-]+$/.test(data.priceId)) throw new Error("Invalid priceId");
      if (!COIN_PACKS[data.priceId]) throw new Error("Unknown coin pack");
      return data;
    },
  )
  .handler(async ({ data, context }): Promise<CheckoutSessionResult> => {
    try {
      const userId = context.userId;
      const stripe = createStripeClient(data.environment);
      const coins = COIN_PACKS[data.priceId];

      const prices = await stripe.prices.list({ lookup_keys: [data.priceId] });
      if (!prices.data.length) throw new Error("Price not found");
      const stripePrice = prices.data[0];

      const customerId = await resolveOrCreateCustomer(stripe, {
        email: data.customerEmail,
        userId,
      });

      const productId =
        typeof stripePrice.product === "string"
          ? stripePrice.product
          : stripePrice.product.id;
      const product = await stripe.products.retrieve(productId);

      const session = await stripe.checkout.sessions.create({
        line_items: [{ price: stripePrice.id, quantity: 1 }],
        mode: "payment",
        ui_mode: "embedded_page",
        return_url: data.returnUrl,
        customer: customerId,
        payment_intent_data: { description: product.name },
        metadata: {
          userId,
          coins: String(coins),
          priceId: data.priceId,
        },
      });

      return { clientSecret: session.client_secret ?? "" };
    } catch (error) {
      return { error: getStripeErrorMessage(error) };
    }
  });

// Coins a creator earns each successful monthly supporter payment.
const SUPPORTER_MONTHLY_COINS = 350;
const SUPPORTER_PRICE_ID = "creator_supporter_monthly";

// ============ Creator supporter subscription (recurring) ============
export const createSupporterCheckoutSession = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (data: {
      creatorId: string;
      customerEmail?: string;
      returnUrl: string;
      environment: StripeEnv;
    }) => {
      if (!/^[0-9a-fA-F-]{36}$/.test(data.creatorId)) throw new Error("Invalid creator");
      return data;
    },
  )
  .handler(async ({ data, context }): Promise<CheckoutSessionResult> => {
    try {
      const subscriberId = context.userId;
      if (subscriberId === data.creatorId) {
        return { error: "You can't subscribe to yourself." };
      }
      const stripe = createStripeClient(data.environment);

      const prices = await stripe.prices.list({ lookup_keys: [SUPPORTER_PRICE_ID] });
      if (!prices.data.length) throw new Error("Subscription price not found");
      const stripePrice = prices.data[0];

      const customerId = await resolveOrCreateCustomer(stripe, {
        email: data.customerEmail,
        userId: subscriberId,
      });

      const session = await stripe.checkout.sessions.create({
        line_items: [{ price: stripePrice.id, quantity: 1 }],
        mode: "subscription",
        ui_mode: "embedded_page",
        return_url: data.returnUrl,
        customer: customerId,
        metadata: {
          userId: subscriberId,
          creatorId: data.creatorId,
          coins: String(SUPPORTER_MONTHLY_COINS),
        },
        subscription_data: {
          metadata: {
            userId: subscriberId,
            creatorId: data.creatorId,
            coins: String(SUPPORTER_MONTHLY_COINS),
          },
        },
      });

      return { clientSecret: session.client_secret ?? "" };
    } catch (error) {
      return { error: getStripeErrorMessage(error) };
    }
  });

// ============ ViralSnap Pro subscription ($4.99/mo) ============
const PRO_PRICE_ID = "pro_monthly";

export const createProCheckoutSession = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (data: { customerEmail?: string; returnUrl: string; environment: StripeEnv }) => data,
  )
  .handler(async ({ data, context }): Promise<CheckoutSessionResult> => {
    try {
      const userId = context.userId;
      const stripe = createStripeClient(data.environment);

      // Block duplicate Pro subscriptions.
      const { data: existing } = await context.supabase
        .from("pro_subscriptions")
        .select("status, current_period_end")
        .eq("user_id", userId)
        .eq("environment", data.environment)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      const stillActive =
        existing &&
        (["active", "trialing"].includes(existing.status) ||
          (existing.status === "canceled" &&
            existing.current_period_end &&
            new Date(existing.current_period_end) > new Date()));
      if (stillActive) return { error: "You already have ViralSnap Pro." };

      const prices = await stripe.prices.list({ lookup_keys: [PRO_PRICE_ID] });
      if (!prices.data.length) throw new Error("Pro price not found");
      const stripePrice = prices.data[0];

      const customerId = await resolveOrCreateCustomer(stripe, {
        email: data.customerEmail,
        userId,
      });

      const session = await stripe.checkout.sessions.create({
        line_items: [{ price: stripePrice.id, quantity: 1 }],
        mode: "subscription",
        ui_mode: "embedded_page",
        return_url: data.returnUrl,
        customer: customerId,
        metadata: { userId, plan: "pro" },
        subscription_data: { metadata: { userId, plan: "pro" } },
      });

      return { clientSecret: session.client_secret ?? "" };
    } catch (error) {
      return { error: getStripeErrorMessage(error) };
    }
  });

type PortalResult = { url: string } | { error: string };

// Opens the Stripe billing portal so a subscriber can manage/cancel.
export const createSubscriptionPortalSession = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { returnUrl?: string; environment: StripeEnv }) => data)
  .handler(async ({ data, context }): Promise<PortalResult> => {
    const { supabase, userId } = context;

    // Prefer the Pro subscription's customer, falling back to supporter subs.
    const { data: proSub } = await supabase
      .from("pro_subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", userId)
      .eq("environment", data.environment)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    let customerId = proSub?.stripe_customer_id as string | undefined;

    if (!customerId) {
      const { data: sub } = await supabase
        .from("creator_subscriptions")
        .select("stripe_customer_id")
        .eq("subscriber_id", userId)
        .eq("environment", data.environment)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      customerId = sub?.stripe_customer_id as string | undefined;
    }

    const sub = customerId ? { stripe_customer_id: customerId } : null;
    if (!sub?.stripe_customer_id) return { error: "No subscription found." };

    try {
      const stripe = createStripeClient(data.environment);
      const portal = await stripe.billingPortal.sessions.create({
        customer: sub.stripe_customer_id as string,
        ...(data.returnUrl && { return_url: data.returnUrl }),
      });
      return { url: portal.url };
    } catch (error) {
      return { error: getStripeErrorMessage(error) };
    }
  });


