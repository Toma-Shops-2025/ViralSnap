-- IMMEDIATE takedown: @gayporn_f777 (project ylfrcrigmazlptxnlzqm)
-- Paste into Supabase → SQL Editor → Run

-- Ensure ban columns exist (safe if migration already ran)
alter table public.profiles
  add column if not exists is_banned boolean not null default false,
  add column if not exists banned_at timestamptz,
  add column if not exists ban_reason text;

-- Hide all their posts from the feed immediately
update public.videos
set status = 'removed'
where creator_id = 'e03193ff-c723-4dc5-90e9-4c7994111351';

-- Mark account banned (blocks future uploads once app deploys)
update public.profiles
set
  is_banned = true,
  banned_at = now(),
  ban_reason = 'Adult/explicit content — community guidelines violation'
where id = 'e03193ff-c723-4dc5-90e9-4c7994111351';

-- Permanently delete the account (cascades profile + related rows)
delete from auth.users
where id = 'e03193ff-c723-4dc5-90e9-4c7994111351';

-- Verify nothing left published for this user
select id, title, status
from public.videos
where creator_id = 'e03193ff-c723-4dc5-90e9-4c7994111351';
