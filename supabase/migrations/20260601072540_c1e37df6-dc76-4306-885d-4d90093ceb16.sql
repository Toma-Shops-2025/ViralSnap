REVOKE EXECUTE ON FUNCTION public.request_payout(integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.request_payout(integer) TO authenticated;