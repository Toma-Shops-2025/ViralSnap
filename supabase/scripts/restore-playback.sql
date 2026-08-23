-- ViralSnap: restore feed playback (project ylfrcrigmazlptxnlzqm)
-- Paste into Supabase → SQL Editor → Run

-- 1) Public storage buckets
insert into storage.buckets (id, name, public) values
  ('avatars', 'avatars', true),
  ('videos', 'videos', true),
  ('covers', 'covers', true)
on conflict (id) do nothing;

-- Long-form uploads (default bucket cap is 50MB)
update storage.buckets set file_size_limit = 524288000 where id = 'videos';

-- 2) Storage policies (idempotent)
drop policy if exists "Public read media" on storage.objects;
create policy "Public read media" on storage.objects
  for select using (bucket_id in ('videos', 'covers', 'avatars'));

drop policy if exists "Users upload own media" on storage.objects;
create policy "Users upload own media" on storage.objects
  for insert to authenticated
  with check (bucket_id in ('videos', 'covers', 'avatars') and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "Users update own media" on storage.objects;
create policy "Users update own media" on storage.objects
  for update to authenticated
  using (bucket_id in ('videos', 'covers', 'avatars') and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "Users delete own media" on storage.objects;
create policy "Users delete own media" on storage.objects
  for delete to authenticated
  using (bucket_id in ('videos', 'covers', 'avatars') and (storage.foldername(name))[1] = auth.uid()::text);

-- 3) Rewrite URLs from deleted project
update public.videos
set media_url = replace(media_url, 'https://gmvpdlefvsafqrblbpfi.supabase.co', 'https://ylfrcrigmazlptxnlzqm.supabase.co')
where media_url like '%gmvpdlefvsafqrblbpfi.supabase.co%';

update public.videos
set cover_url = replace(cover_url, 'https://gmvpdlefvsafqrblbpfi.supabase.co', 'https://ylfrcrigmazlptxnlzqm.supabase.co')
where cover_url like '%gmvpdlefvsafqrblbpfi.supabase.co%';

update public.profiles
set avatar_url = replace(avatar_url, 'https://gmvpdlefvsafqrblbpfi.supabase.co', 'https://ylfrcrigmazlptxnlzqm.supabase.co')
where avatar_url like '%gmvpdlefvsafqrblbpfi.supabase.co%';

-- 4) Hide broken feed rows (files were never migrated to this project).
-- Keeps ~10 legacy Mux HLS videos that still stream publicly.
update public.videos
set status = 'removed'
where status = 'published'
  and mux_playback_id is null;

-- 5) Summary
select status, count(*) as n from public.videos group by status order by n desc;
