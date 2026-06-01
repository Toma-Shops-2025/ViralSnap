import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { type StripeEnv, verifyWebhook } from "@/lib/stripe.server";

let _supabase: ReturnType<typeof createClient> | null = null;
function getSupabase() {
  if (!_supabase) {
    _supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );
  }
  return _supabase;
}

// ============ One-time coin purchases ============
async function handleCheckoutCompleted(session: any) {
  // Subscription checkouts are handled via customer.subscription.* events.
  if (session.mode && session.mode !== "payment") return;
  if (session.payment_status !== "paid") return;

  const userId = session.metadata?.userId;
  const coins = Number(session.metadata?.coins ?? 0);
  if (!userId || !coins) {
    console.error("Checkout session missing userId/coins metadata", session.id);
    return;
  }

  const { error } = await getSupabase().rpc("credit_coin_purchase" as never, {
    _user_id: userId,
    _coins: coins,
    _amount_cents: session.amount_total ?? 0,
    _session_id: session.id,
  } as never);

  if (error) {
    console.error("Failed to credit coins:", error);
    throw new Error(error.message);
  }
}

// ============ Creator supporter subscriptions ============
async function handleSubscriptionUpsert(subscription: any, env: StripeEnv) {
  const meta = subscription.metadata ?? {};
  const subscriberId = meta.userId;
  const creatorId = meta.creatorId;
  const coins = Number(meta.coins ?? 0);
  if (!subscriberId || !creatorId) {
    console.error("Subscription missing subscriber/creator metadata", subscription.id);
    return;
  }

  const item = subscription.items?.data?.[0];
  const priceId = item?.price?.lookup_key || item?.price?.id || "";
  const amountCents = item?.price?.unit_amount ?? 0;
  const periodEnd =
    item?.current_period_end ?? subscription.current_period_end ?? null;

  await getSupabase()
    .from("creator_subscriptions" as never)
    .upsert(
      {
        subscriber_id: subscriberId,
        creator_id: creatorId,
        stripe_subscription_id: subscription.id,
        stripe_customer_id: subscription.customer,
        price_id: priceId,
        monthly_coins: coins,
        status: subscription.status,
        current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
        cancel_at_period_end: subscription.cancel_at_period_end ?? false,
        environment: env,
        updated_at: new Date().toISOString(),
      } as never,
      { onConflict: "stripe_subscription_id" } as never,
    );

  // Credit the creator for the active billing period (idempotent on invoice id).
  const latestInvoice =
    typeof subscription.latest_invoice === "string"
      ? subscription.latest_invoice
      : subscription.latest_invoice?.id;

  if (
    latestInvoice &&
    coins > 0 &&
    (subscription.status === "active" || subscription.status === "trialing")
  ) {
    const { error } = await getSupabase().rpc("credit_subscription_invoice" as never, {
      _creator_id: creatorId,
      _subscriber_id: subscriberId,
      _coins: coins,
      _amount_cents: amountCents,
      _invoice_id: latestInvoice,
    } as never);
    if (error) console.error("Failed to credit subscription invoice:", error);
  }
}

async function handleSubscriptionDeleted(subscription: any, env: StripeEnv) {
  await getSupabase()
    .from("creator_subscriptions" as never)
    .update({ status: "canceled", updated_at: new Date().toISOString() } as never)
    .eq("stripe_subscription_id", subscription.id)
    .eq("environment", env);
}

async function handleWebhook(req: Request, env: StripeEnv) {
  const event = await verifyWebhook(req, env);

  switch (event.type) {
    case "checkout.session.completed":
      await handleCheckoutCompleted(event.data.object);
      break;
    case "customer.subscription.created":
    case "customer.subscription.updated":
      await handleSubscriptionUpsert(event.data.object, env);
      break;
    case "customer.subscription.deleted":
      await handleSubscriptionDeleted(event.data.object, env);
      break;
    default:
      console.log("Unhandled event:", event.type);
  }
}

export const Route = createFileRoute("/api/public/payments/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const rawEnv = new URL(request.url).searchParams.get("env");
        if (rawEnv !== "sandbox" && rawEnv !== "live") {
          console.error("Webhook received with invalid env query parameter:", rawEnv);
          return Response.json({ received: true, ignored: "invalid env" });
        }
        const env: StripeEnv = rawEnv;
        try {
          await handleWebhook(request, env);
          return Response.json({ received: true });
        } catch (e) {
          console.error("Webhook error:", e);
          return new Response("Webhook error", { status: 400 });
        }
      },
    },
  },
});
