import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import {
  type StripeEnv,
  createStripeClient,
  getStripeErrorMessage,
} from "@/lib/stripe.server";

type ConnectStatus = {
  hasAccount: boolean;
  payoutsEnabled: boolean;
  detailsSubmitted: boolean;
};

// Reads the creator's Connect account status and syncs the cached flag.
export const getConnectStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { environment: StripeEnv }) => data)
  .handler(async ({ data, context }): Promise<ConnectStatus | { error: string }> => {
    const { supabase, userId } = context;
    const { data: profile } = await supabase
      .from("profiles")
      .select("stripe_connect_account_id")
      .eq("id", userId)
      .maybeSingle();

    const accountId = profile?.stripe_connect_account_id as string | null | undefined;
    if (!accountId) {
      return { hasAccount: false, payoutsEnabled: false, detailsSubmitted: false };
    }

    try {
      const stripe = createStripeClient(data.environment);
      const account = await stripe.accounts.retrieve(accountId);
      const payoutsEnabled = !!account.payouts_enabled;
      await supabaseAdmin
        .from("profiles")
        .update({ payouts_enabled: payoutsEnabled })
        .eq("id", userId);
      return {
        hasAccount: true,
        payoutsEnabled,
        detailsSubmitted: !!account.details_submitted,
      };
    } catch (error) {
      return { error: getStripeErrorMessage(error) };
    }
  });

// Creates (or reuses) a Connect Express account and returns an onboarding URL.
export const createConnectOnboardingLink = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (data: { email?: string; returnUrl: string; environment: StripeEnv }) => data,
  )
  .handler(async ({ data, context }): Promise<{ url: string } | { error: string }> => {
    const { supabase, userId } = context;
    try {
      const stripe = createStripeClient(data.environment);

      const { data: profile } = await supabase
        .from("profiles")
        .select("stripe_connect_account_id, username, display_name, bio")
        .eq("id", userId)
        .maybeSingle();

      let accountId = profile?.stripe_connect_account_id as string | null | undefined;

      // Each creator's public, crawlable profile — required by Stripe for
      // marketplace/Connect verification.
      const profileUrl = profile?.username
        ? `https://viralsnap.online/u/${profile.username}`
        : "https://viralsnap.online";
      const businessName = profile?.display_name || profile?.username || "ViralSnap creator";
      const productDescription =
        (profile?.bio && profile.bio.trim()) ||
        "Short-form video creator earning tips, gifts and supporter subscriptions on ViralSnap.";

      const businessProfile = {
        url: profileUrl,
        name: businessName,
        product_description: productDescription,
      };

      if (!accountId) {
        const account = await stripe.accounts.create({
          type: "express",
          country: "US",
          business_type: "individual",
          ...(data.email && { email: data.email }),
          // Transfers-only payout model (separate charges & transfers); the
          // platform collects payments, then transfers earnings on payout.
          capabilities: { transfers: { requested: true } },
          business_profile: businessProfile,
          metadata: { userId },
        });
        accountId = account.id;
        await supabaseAdmin
          .from("profiles")
          .update({ stripe_connect_account_id: accountId })
          .eq("id", userId);
      } else {
        // Backfill business_profile.url on accounts created before this was set.
        try {
          await stripe.accounts.update(accountId, {
            business_profile: businessProfile,
          });
        } catch {
          // Non-fatal: onboarding can still proceed.
        }
      }

      const link = await stripe.accountLinks.create({
        account: accountId,
        refresh_url: data.returnUrl,
        return_url: data.returnUrl,
        type: "account_onboarding",
      });

      return { url: link.url };
    } catch (error) {
      return { error: getStripeErrorMessage(error) };
    }
  });

type PayoutResult =
  | { success: true; amountCents: number; balance: number }
  | { error: string };

// Reserves coins, then transfers funds to the creator's connected account.
export const requestCreatorPayout = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { coins: number; environment: StripeEnv }) => {
    if (!Number.isInteger(data.coins) || data.coins < 10000) {
      throw new Error("Minimum payout is 10,000 coins");
    }
    return data;
  })
  .handler(async ({ data, context }): Promise<PayoutResult> => {
    const { supabase, userId } = context;

    const { data: profile } = await supabase
      .from("profiles")
      .select("stripe_connect_account_id, payouts_enabled")
      .eq("id", userId)
      .maybeSingle();

    const accountId = profile?.stripe_connect_account_id as string | null | undefined;
    if (!accountId || !profile?.payouts_enabled) {
      return { error: "Connect a payout account before requesting a payout." };
    }

    // Atomically reserve coins (deducts balance + logs withdrawal).
    const { data: reserved, error: reserveError } = await supabase.rpc("request_payout", {
      _coins: data.coins,
    });
    if (reserveError) return { error: reserveError.message };

    const result = reserved as { request_id: string; amount_cents: number; balance: number };

    try {
      const stripe = createStripeClient(data.environment);
      const transfer = await stripe.transfers.create({
        amount: result.amount_cents,
        currency: "usd",
        destination: accountId,
        metadata: { userId, payoutRequestId: result.request_id },
      });

      await supabaseAdmin
        .from("payout_requests")
        .update({
          status: "paid",
          stripe_transfer_id: transfer.id,
          processed_at: new Date().toISOString(),
        })
        .eq("id", result.request_id);

      return { success: true, amountCents: result.amount_cents, balance: result.balance };
    } catch (error) {
      // Refund the reserved coins on failure.
      await supabaseAdmin.rpc("refund_payout", { _request_id: result.request_id });
      return { error: getStripeErrorMessage(error) };
    }
  });
