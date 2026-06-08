-- Add 'processing' and 'errored' values to video_status enum
ALTER TYPE public.video_status ADD VALUE IF NOT EXISTS 'processing';
ALTER TYPE public.video_status ADD VALUE IF NOT EXISTS 'errored';

-- Add Mux tracking columns to videos
ALTER TABLE public.videos
  ADD COLUMN IF NOT EXISTS mux_upload_id text,
  ADD COLUMN IF NOT EXISTS mux_asset_id text,
  ADD COLUMN IF NOT EXISTS mux_playback_id text,
  ADD COLUMN IF NOT EXISTS mux_asset_status text;

-- Mux direct uploads have no storage URL until (and unless) processed
ALTER TABLE public.videos ALTER COLUMN media_url DROP NOT NULL;
ALTER TABLE public.videos ALTER COLUMN media_url SET DEFAULT NULL;