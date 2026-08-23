-- Ban flag for policy-violating accounts
alter table public.profiles
  add column if not exists is_banned boolean not null default false,
  add column if not exists banned_at timestamptz,
  add column if not exists ban_reason text;

create index if not exists idx_profiles_is_banned
  on public.profiles (is_banned)
  where is_banned;
