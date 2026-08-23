-- Raise videos bucket limit (default is 50MB) to match app Pro upload cap.

update storage.buckets
set file_size_limit = 524288000
where id = 'videos';

insert into storage.buckets (id, name, public, file_size_limit)
values ('videos', 'videos', true, 524288000)
on conflict (id) do update set file_size_limit = excluded.file_size_limit;
