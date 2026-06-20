CREATE OR REPLACE FUNCTION public.request_payout(_coins integer)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
DECLARE _uid uuid := auth.uid(); _bal integer; _req uuid; _cents integer;
BEGIN
  IF _uid IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  IF _coins < 1000 THEN RAISE EXCEPTION 'Minimum payout is 1,000 coins'; END IF;

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
$function$;