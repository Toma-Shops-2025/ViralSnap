-- ViralSnap: fix media URLs after Supabase project migration.
-- Run in Supabase SQL Editor for project ylfrcrigmazlptxnlzqm

-- Ensure public storage buckets exist
insert into storage.buckets (id, name, public) values
  ('avatars', 'avatars', true),
  ('videos', 'videos', true),
  ('covers', 'covers', true)
on conflict (id) do nothing;

update public.videos
set media_url = replace(
  media_url,
  'https://gmvpdlefvsafqrblbpfi.supabase.co',
  'https://ylfrcrigmazlptxnlzqm.supabase.co'
)
where media_url like '%gmvpdlefvsafqrblbpfi.supabase.co%';

update public.videos
set cover_url = replace(
  cover_url,
  'https://gmvpdlefvsafqrblbpfi.supabase.co',
  'https://ylfrcrigmazlptxnlzqm.supabase.co'
)
where cover_url like '%gmvpdlefvsafqrblbpfi.supabase.co%';

update public.profiles
set avatar_url = replace(
  avatar_url,
  'https://gmvpdlefvsafqrblbpfi.supabase.co',
  'https://ylfrcrigmazlptxnlzqm.supabase.co'
)
where avatar_url like '%gmvpdlefvsafqrblbpfi.supabase.co%';

-- Unpublish broken Google seed/placeholder videos (URLs now return 403)
update public.videos
set status = 'removed'
where status = 'published'
  and media_url like '%commondatastorage.googleapis.com/gtv-videos-bucket/sample%';
