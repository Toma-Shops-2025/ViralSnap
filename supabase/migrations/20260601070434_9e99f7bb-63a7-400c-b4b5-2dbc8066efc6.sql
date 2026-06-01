CREATE TABLE public.coin_purchases (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  stripe_session_id text NOT NULL UNIQUE,
  coins integer NOT NULL,
  amount_cents integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'completed',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT ON public.coin_purchases TO authenticated;
GRANT ALL ON public.coin_purchases TO service_role;

ALTER TABLE public.coin_purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own purchases"
ON public.coin_purchases
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.credit_coin_purchase(_user_id uuid, _coins integer, _amount_cents integer, _session_id text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _new_balance integer;
BEGIN
  IF _coins <= 0 THEN RAISE EXCEPTION 'Invalid coin amount'; END IF;

  -- Idempotency: skip if this payment was already credited
  IF EXISTS (SELECT 1 FROM public.coin_purchases WHERE stripe_session_id = _session_id) THEN
    SELECT coin_balance INTO _new_balance FROM public.profiles WHERE id = _user_id;
    RETURN jsonb_build_object('already_processed', true, 'balance', _new_balance);
  END IF;

  INSERT INTO public.coin_purchases (user_id, stripe_session_id, coins, amount_cents)
  VALUES (_user_id, _session_id, _coins, _amount_cents);

  UPDATE public.profiles
    SET coin_balance = coin_balance + _coins
    WHERE id = _user_id
    RETURNING coin_balance INTO _new_balance;

  INSERT INTO public.coin_transactions (user_id, type, amount, balance_after, description)
  VALUES (_user_id, 'purchase', _coins, _new_balance, _coins || ' ViralCoins purchased');

  RETURN jsonb_build_object('already_processed', false, 'balance', _new_balance);
END;
$$;