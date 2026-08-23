-- Restore missing default on videos.id (live DB drifted; inserts were sending null id).
CREATE EXTENSION IF NOT EXISTS pgcrypto;

ALTER TABLE public.videos
  ALTER COLUMN id SET DEFAULT gen_random_uuid();
