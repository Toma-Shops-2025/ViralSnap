
INSERT INTO storage.buckets (id, name, public) VALUES
  ('videos', 'videos', true),
  ('covers', 'covers', true),
  ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Public read for all three buckets
CREATE POLICY "Public read media" ON storage.objects FOR SELECT USING (bucket_id IN ('videos','covers','avatars'));

-- Authenticated users can upload to their own folder (path prefix = their uid)
CREATE POLICY "Users upload own media" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id IN ('videos','covers','avatars') AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users update own media" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id IN ('videos','covers','avatars') AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users delete own media" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id IN ('videos','covers','avatars') AND (storage.foldername(name))[1] = auth.uid()::text);
