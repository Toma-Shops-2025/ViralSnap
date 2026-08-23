-- ViralSnap: remove pre-fix legacy videos from the feed (project ylfrcrigmazlptxnlzqm)
-- Run in Supabase → SQL Editor → Run
--
-- Removes ~10 old Mux-only HLS posts that stall on pause with the new player.
-- Keeps only uploads stored in the current Supabase videos bucket.

update public.videos
set status = 'removed'
where status = 'published'
  and (
    mux_playback_id is not null
    or coalesce(media_url, '') = ''
    or media_url not like '%ylfrcrigmazlptxnlzqm.supabase.co/storage/v1/object/public/videos/%'
  );

select status, count(*) as n
from public.videos
group by status
order by n desc;
