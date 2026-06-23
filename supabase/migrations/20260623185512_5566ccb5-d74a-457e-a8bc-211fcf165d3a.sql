ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS link_url text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS rate_rewarded boolean NOT NULL DEFAULT false;

CREATE OR REPLACE FUNCTION public.claim_rate_reward()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE _uid uuid := auth.uid(); _bal integer; _reward integer := 100;
BEGIN
  IF _uid IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;

  IF EXISTS (SELECT 1 FROM public.profiles WHERE id = _uid AND rate_rewarded) THEN
    SELECT coin_balance INTO _bal FROM public.profiles WHERE id = _uid;
    RETURN jsonb_build_object('already_claimed', true, 'balance', _bal);
  END IF;

  UPDATE public.profiles
    SET coin_balance = coin_balance + _reward,
        rate_rewarded = true
    WHERE id = _uid
    RETURNING coin_balance INTO _bal;

  INSERT INTO public.coin_transactions (user_id, type, amount, balance_after, description)
  VALUES (_uid, 'welcome', _reward, _bal, 'Reward for rating ViralSnap');

  RETURN jsonb_build_object('already_claimed', false, 'reward', _reward, 'balance', _bal);
END;
$$;

GRANT EXECUTE ON FUNCTION public.claim_rate_reward() TO authenticated;