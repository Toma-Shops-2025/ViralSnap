-- ============ Creator payouts (Stripe Connect) on profiles ============
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS stripe_connect_account_id text,
  ADD COLUMN IF NOT EXISTS payouts_enabled boolean NOT NULL DEFAULT false;

-- ============ Creator supporter subscriptions (Stripe-billed) ============
CREATE TABLE IF NOT EXISTS public.creator_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subscriber_id uuid NOT NULL,
  creator_id uuid NOT NULL,
  stripe_subscription_id text NOT NULL UNIQUE,
  stripe_customer_id text NOT NULL,
  price_id text NOT NULL,
  monthly_coins integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'active',
  current_period_end timestamptz,
  cancel_at_period_end boolean NOT NULL DEFAULT false,
  environment text NOT NULL DEFAULT 'sandbox',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_creator_subs_subscriber ON public.creator_subscriptions(subscriber_id);
CREATE INDEX IF NOT EXISTS idx_creator_subs_creator ON public.creator_subscriptions(creator_id);

GRANT SELECT ON public.creator_subscriptions TO authenticated;
GRANT ALL ON public.creator_subscriptions TO service_role;

ALTER TABLE public.creator_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Subscribers and creators can view subscriptions"
  ON public.creator_subscriptions FOR SELECT TO authenticated
  USING (auth.uid() = subscriber_id OR auth.uid() = creator_id);

CREATE POLICY "Service role manages creator subscriptions"
  ON public.creator_subscriptions FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ============ Idempotent subscription invoice payments ============
CREATE TABLE IF NOT EXISTS public.subscription_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_invoice_id text NOT NULL UNIQUE,
  creator_id uuid NOT NULL,
  subscriber_id uuid NOT NULL,
  coins integer NOT NULL,
  amount_cents integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.subscription_payments TO authenticated;
GRANT ALL ON public.subscription_payments TO service_role;

ALTER TABLE public.subscription_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Creators can view their subscription payments"
  ON public.subscription_payments FOR SELECT TO authenticated
  USING (auth.uid() = creator_id);

-- ============ Payout requests ============
CREATE TABLE IF NOT EXISTS public.payout_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  coins integer NOT NULL,
  amount_cents integer NOT NULL,
  status text NOT NULL DEFAULT 'processing',
  stripe_transfer_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  processed_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_payout_requests_user ON public.payout_requests(user_id);

GRANT SELECT ON public.payout_requests TO authenticated;
GRANT ALL ON public.payout_requests TO service_role;

ALTER TABLE public.payout_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own payout requests"
  ON public.payout_requests FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Service role manages payout requests"
  ON public.payout_requests FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ============ Functions ============

-- Credit a creator for a subscription invoice (idempotent on invoice id).
CREATE OR REPLACE FUNCTION public.credit_subscription_invoice(
  _creator_id uuid, _subscriber_id uuid, _coins integer, _amount_cents integer, _invoice_id text
) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _bal integer;
BEGIN
  IF EXISTS (SELECT 1 FROM public.subscription_payments WHERE stripe_invoice_id = _invoice_id) THEN
    RETURN jsonb_build_object('already_processed', true);
  END IF;

  INSERT INTO public.subscription_payments (stripe_invoice_id, creator_id, subscriber_id, coins, amount_cents)
  VALUES (_invoice_id, _creator_id, _subscriber_id, _coins, _amount_cents);

  UPDATE public.profiles
    SET coin_balance = coin_balance + _coins,
        total_earned = total_earned + _coins
    WHERE id = _creator_id
    RETURNING coin_balance INTO _bal;

  INSERT INTO public.coin_transactions (user_id, type, amount, balance_after, description)
  VALUES (_creator_id, 'gift_received', _coins, _bal, 'Supporter subscription payment');

  RETURN jsonb_build_object('already_processed', false, 'balance', _bal);
END;
$$;

-- Atomically reserve coins for a payout (run as the authenticated creator).
CREATE OR REPLACE FUNCTION public.request_payout(_coins integer)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _uid uuid := auth.uid(); _bal integer; _req uuid; _cents integer;
BEGIN
  IF _uid IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  IF _coins < 10000 THEN RAISE EXCEPTION 'Minimum payout is 10,000 coins'; END IF;

  SELECT coin_balance INTO _bal FROM public.profiles WHERE id = _uid FOR UPDATE;
  IF _bal < _coins THEN RAISE EXCEPTION 'Not enough coins'; END IF;

  _cents := floor(_coins * 0.5); -- 1000 coins = $5.00

  UPDATE public.profiles SET coin_balance = coin_balance - _coins
    WHERE id = _uid RETURNING coin_balance INTO _bal;

  INSERT INTO public.payout_requests (user_id, coins, amount_cents, status)
  VALUES (_uid, _coins, _cents, 'processing') RETURNING id INTO _req;

  INSERT INTO public.coin_transactions (user_id, type, amount, balance_after, description)
  VALUES (_uid, 'withdrawal', -_coins, _bal, 'Payout request');

  RETURN jsonb_build_object('request_id', _req, 'amount_cents', _cents, 'balance', _bal);
END;
$$;

-- Refund a failed payout (service role only).
CREATE OR REPLACE FUNCTION public.refund_payout(_request_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _r record; _bal integer;
BEGIN
  SELECT * INTO _r FROM public.payout_requests WHERE id = _request_id AND status = 'processing' FOR UPDATE;
  IF NOT FOUND THEN RETURN; END IF;

  UPDATE public.payout_requests SET status = 'failed', processed_at = now() WHERE id = _request_id;

  UPDATE public.profiles SET coin_balance = coin_balance + _r.coins
    WHERE id = _r.user_id RETURNING coin_balance INTO _bal;

  INSERT INTO public.coin_transactions (user_id, type, amount, balance_after, description)
  VALUES (_r.user_id, 'purchase', _r.coins, _bal, 'Payout refund (transfer failed)');
END;
$$;

REVOKE EXECUTE ON FUNCTION public.credit_subscription_invoice(uuid, uuid, integer, integer, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.credit_subscription_invoice(uuid, uuid, integer, integer, text) TO service_role;

REVOKE EXECUTE ON FUNCTION public.refund_payout(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.refund_payout(uuid) TO service_role;

GRANT EXECUTE ON FUNCTION public.request_payout(integer) TO authenticated;