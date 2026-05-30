
-- ========== ENUMS ==========
CREATE TYPE public.app_role AS ENUM ('user', 'admin');
CREATE TYPE public.video_status AS ENUM ('published', 'removed');
CREATE TYPE public.gift_type AS ENUM ('fire', 'rocket', 'diamond', 'crown', 'heartburst', 'lightning');
CREATE TYPE public.coin_txn_type AS ENUM ('purchase', 'gift_sent', 'gift_received', 'welcome', 'withdrawal');
CREATE TYPE public.report_status AS ENUM ('pending', 'reviewed', 'resolved', 'dismissed');
CREATE TYPE public.sub_tier AS ENUM ('fan', 'supporter', 'vip');
CREATE TYPE public.sub_status AS ENUM ('active', 'cancelled');
CREATE TYPE public.campaign_category AS ENUM ('fashion','beauty','tech','food','fitness','gaming','lifestyle','music','travel','education');
CREATE TYPE public.campaign_status AS ENUM ('active','paused','completed','cancelled');
CREATE TYPE public.application_status AS ENUM ('pending','accepted','rejected');
CREATE TYPE public.stream_status AS ENUM ('live','ended');

-- ========== PROFILES ==========
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL DEFAULT '',
  bio TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  coin_balance INTEGER NOT NULL DEFAULT 0,
  total_earned INTEGER NOT NULL DEFAULT 0,
  total_spent INTEGER NOT NULL DEFAULT 0,
  age_verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.profiles TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- ========== USER ROLES ==========
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL DEFAULT 'user',
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- ========== VIDEOS ==========
CREATE TABLE public.videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT '',
  caption TEXT NOT NULL DEFAULT '',
  media_url TEXT NOT NULL,
  cover_url TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  duration NUMERIC NOT NULL DEFAULT 0,
  view_count INTEGER NOT NULL DEFAULT 0,
  like_count INTEGER NOT NULL DEFAULT 0,
  comment_count INTEGER NOT NULL DEFAULT 0,
  product_title TEXT,
  product_description TEXT,
  product_url TEXT,
  product_cta TEXT,
  is_affiliate BOOLEAN NOT NULL DEFAULT false,
  product_clicks INTEGER NOT NULL DEFAULT 0,
  status public.video_status NOT NULL DEFAULT 'published',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_videos_creator ON public.videos(creator_id);
CREATE INDEX idx_videos_created ON public.videos(created_at DESC);
GRANT SELECT ON public.videos TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.videos TO authenticated;
GRANT ALL ON public.videos TO service_role;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published videos viewable by everyone" ON public.videos FOR SELECT USING (status = 'published' OR auth.uid() = creator_id);
CREATE POLICY "Users can insert own videos" ON public.videos FOR INSERT TO authenticated WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "Users can update own videos" ON public.videos FOR UPDATE TO authenticated USING (auth.uid() = creator_id);
CREATE POLICY "Users can delete own videos" ON public.videos FOR DELETE TO authenticated USING (auth.uid() = creator_id);

-- ========== FOLLOWS ==========
CREATE TABLE public.follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (follower_id, following_id)
);
CREATE INDEX idx_follows_follower ON public.follows(follower_id);
CREATE INDEX idx_follows_following ON public.follows(following_id);
GRANT SELECT ON public.follows TO anon;
GRANT SELECT, INSERT, DELETE ON public.follows TO authenticated;
GRANT ALL ON public.follows TO service_role;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Follows viewable by everyone" ON public.follows FOR SELECT USING (true);
CREATE POLICY "Users can follow" ON public.follows FOR INSERT TO authenticated WITH CHECK (auth.uid() = follower_id);
CREATE POLICY "Users can unfollow" ON public.follows FOR DELETE TO authenticated USING (auth.uid() = follower_id);

-- ========== LIKES ==========
CREATE TABLE public.likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  video_id UUID NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, video_id)
);
CREATE INDEX idx_likes_video ON public.likes(video_id);
CREATE INDEX idx_likes_user ON public.likes(user_id);
GRANT SELECT ON public.likes TO anon;
GRANT SELECT, INSERT, DELETE ON public.likes TO authenticated;
GRANT ALL ON public.likes TO service_role;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Likes viewable by everyone" ON public.likes FOR SELECT USING (true);
CREATE POLICY "Users can like" ON public.likes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unlike" ON public.likes FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ========== COMMENTS ==========
CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id UUID NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  like_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_comments_video ON public.comments(video_id);
GRANT SELECT ON public.comments TO anon;
GRANT SELECT, INSERT, DELETE ON public.comments TO authenticated;
GRANT ALL ON public.comments TO service_role;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Comments viewable by everyone" ON public.comments FOR SELECT USING (true);
CREATE POLICY "Users can comment" ON public.comments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments" ON public.comments FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ========== GIFTS ==========
CREATE TABLE public.gifts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  video_id UUID REFERENCES public.videos(id) ON DELETE SET NULL,
  stream_id UUID,
  gift_type public.gift_type NOT NULL,
  coin_amount INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_gifts_receiver ON public.gifts(receiver_id);
GRANT SELECT ON public.gifts TO authenticated;
GRANT ALL ON public.gifts TO service_role;
ALTER TABLE public.gifts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view gifts they sent or received" ON public.gifts FOR SELECT TO authenticated USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- ========== COIN TRANSACTIONS ==========
CREATE TABLE public.coin_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type public.coin_txn_type NOT NULL,
  amount INTEGER NOT NULL,
  balance_after INTEGER NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_coin_txn_user ON public.coin_transactions(user_id, created_at DESC);
GRANT SELECT ON public.coin_transactions TO authenticated;
GRANT ALL ON public.coin_transactions TO service_role;
ALTER TABLE public.coin_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own transactions" ON public.coin_transactions FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- ========== BLOCKS ==========
CREATE TABLE public.blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blocker_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  blocked_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (blocker_id, blocked_id)
);
GRANT SELECT, INSERT, DELETE ON public.blocks TO authenticated;
GRANT ALL ON public.blocks TO service_role;
ALTER TABLE public.blocks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own blocks" ON public.blocks FOR SELECT TO authenticated USING (auth.uid() = blocker_id);
CREATE POLICY "Users can block" ON public.blocks FOR INSERT TO authenticated WITH CHECK (auth.uid() = blocker_id);
CREATE POLICY "Users can unblock" ON public.blocks FOR DELETE TO authenticated USING (auth.uid() = blocker_id);

-- ========== REPORTS ==========
CREATE TABLE public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL,
  target_id UUID NOT NULL,
  reason TEXT NOT NULL,
  notes TEXT,
  status public.report_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.reports TO authenticated;
GRANT ALL ON public.reports TO service_role;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own reports" ON public.reports FOR SELECT TO authenticated USING (auth.uid() = reporter_id);
CREATE POLICY "Users can report" ON public.reports FOR INSERT TO authenticated WITH CHECK (auth.uid() = reporter_id);

-- ========== SUBSCRIPTIONS ==========
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscriber_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  tier public.sub_tier NOT NULL DEFAULT 'fan',
  monthly_coins INTEGER NOT NULL DEFAULT 0,
  status public.sub_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (subscriber_id, creator_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.subscriptions TO authenticated;
GRANT ALL ON public.subscriptions TO service_role;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view subs they are part of" ON public.subscriptions FOR SELECT TO authenticated USING (auth.uid() = subscriber_id OR auth.uid() = creator_id);
CREATE POLICY "Users can subscribe" ON public.subscriptions FOR INSERT TO authenticated WITH CHECK (auth.uid() = subscriber_id);
CREATE POLICY "Subscribers can update own sub" ON public.subscriptions FOR UPDATE TO authenticated USING (auth.uid() = subscriber_id);
CREATE POLICY "Subscribers can delete own sub" ON public.subscriptions FOR DELETE TO authenticated USING (auth.uid() = subscriber_id);

-- ========== CAMPAIGNS ==========
CREATE TABLE public.campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  budget INTEGER NOT NULL DEFAULT 0,
  deadline DATE,
  category public.campaign_category NOT NULL DEFAULT 'lifestyle',
  status public.campaign_status NOT NULL DEFAULT 'active',
  application_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.campaigns TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.campaigns TO authenticated;
GRANT ALL ON public.campaigns TO service_role;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Campaigns viewable by everyone" ON public.campaigns FOR SELECT USING (true);
CREATE POLICY "Users can create campaigns" ON public.campaigns FOR INSERT TO authenticated WITH CHECK (auth.uid() = brand_id);
CREATE POLICY "Brands can update own campaigns" ON public.campaigns FOR UPDATE TO authenticated USING (auth.uid() = brand_id);
CREATE POLICY "Brands can delete own campaigns" ON public.campaigns FOR DELETE TO authenticated USING (auth.uid() = brand_id);

-- ========== CAMPAIGN APPLICATIONS ==========
CREATE TABLE public.campaign_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  pitch TEXT NOT NULL DEFAULT '',
  status public.application_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (campaign_id, creator_id)
);
GRANT SELECT, INSERT ON public.campaign_applications TO authenticated;
GRANT ALL ON public.campaign_applications TO service_role;
ALTER TABLE public.campaign_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Applicants and brands can view" ON public.campaign_applications FOR SELECT TO authenticated USING (
  auth.uid() = creator_id OR auth.uid() IN (SELECT brand_id FROM public.campaigns WHERE id = campaign_id)
);
CREATE POLICY "Creators can apply" ON public.campaign_applications FOR INSERT TO authenticated WITH CHECK (auth.uid() = creator_id);

-- ========== LIVE STREAMS ==========
CREATE TABLE public.live_streams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT '',
  status public.stream_status NOT NULL DEFAULT 'live',
  viewer_count INTEGER NOT NULL DEFAULT 0,
  total_gifts INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ended_at TIMESTAMPTZ
);
GRANT SELECT ON public.live_streams TO anon;
GRANT SELECT, INSERT, UPDATE ON public.live_streams TO authenticated;
GRANT ALL ON public.live_streams TO service_role;
ALTER TABLE public.live_streams ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Streams viewable by everyone" ON public.live_streams FOR SELECT USING (true);
CREATE POLICY "Creators can start streams" ON public.live_streams FOR INSERT TO authenticated WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "Creators can update own streams" ON public.live_streams FOR UPDATE TO authenticated USING (auth.uid() = creator_id);

-- ========== LIVE MESSAGES ==========
CREATE TABLE public.live_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stream_id UUID NOT NULL REFERENCES public.live_streams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_live_messages_stream ON public.live_messages(stream_id, created_at);
GRANT SELECT ON public.live_messages TO anon;
GRANT SELECT, INSERT ON public.live_messages TO authenticated;
GRANT ALL ON public.live_messages TO service_role;
ALTER TABLE public.live_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Live messages viewable by everyone" ON public.live_messages FOR SELECT USING (true);
CREATE POLICY "Users can send live messages" ON public.live_messages FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- ========== LEGAL AGREEMENTS ==========
CREATE TABLE public.legal_agreements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  document TEXT NOT NULL,
  version TEXT NOT NULL DEFAULT '1.0',
  accepted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ip_address TEXT
);
GRANT SELECT, INSERT ON public.legal_agreements TO authenticated;
GRANT ALL ON public.legal_agreements TO service_role;
ALTER TABLE public.legal_agreements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own agreements" ON public.legal_agreements FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can record agreements" ON public.legal_agreements FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- ========== NEW USER TRIGGER ==========
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  base_username TEXT;
  final_username TEXT;
  suffix INTEGER := 0;
BEGIN
  base_username := lower(regexp_replace(COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)), '[^a-z0-9_]', '', 'g'));
  IF base_username = '' OR base_username IS NULL THEN
    base_username := 'creator';
  END IF;
  final_username := base_username;
  WHILE EXISTS (SELECT 1 FROM public.profiles WHERE username = final_username) LOOP
    suffix := suffix + 1;
    final_username := base_username || suffix::TEXT;
  END LOOP;

  INSERT INTO public.profiles (id, username, display_name, coin_balance, age_verified)
  VALUES (
    NEW.id,
    final_username,
    COALESCE(NEW.raw_user_meta_data->>'display_name', final_username),
    500,
    COALESCE((NEW.raw_user_meta_data->>'age_verified')::BOOLEAN, false)
  );

  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');

  INSERT INTO public.coin_transactions (user_id, type, amount, balance_after, description)
  VALUES (NEW.id, 'welcome', 500, 500, 'Welcome bonus — 500 ViralCoins on us!');

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ========== SEND GIFT (atomic 70/30 split) ==========
CREATE OR REPLACE FUNCTION public.send_gift(
  _receiver_id UUID,
  _gift_type public.gift_type,
  _coin_amount INTEGER,
  _video_id UUID DEFAULT NULL,
  _stream_id UUID DEFAULT NULL
)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _sender UUID := auth.uid();
  _sender_balance INTEGER;
  _earned INTEGER;
  _receiver_balance INTEGER;
BEGIN
  IF _sender IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  IF _sender = _receiver_id THEN RAISE EXCEPTION 'You cannot gift yourself'; END IF;
  IF _coin_amount <= 0 THEN RAISE EXCEPTION 'Invalid gift amount'; END IF;

  SELECT coin_balance INTO _sender_balance FROM public.profiles WHERE id = _sender FOR UPDATE;
  IF _sender_balance < _coin_amount THEN RAISE EXCEPTION 'Not enough coins'; END IF;

  _earned := floor(_coin_amount * 0.7);

  -- Deduct from sender
  UPDATE public.profiles
    SET coin_balance = coin_balance - _coin_amount,
        total_spent = total_spent + _coin_amount
    WHERE id = _sender
    RETURNING coin_balance INTO _sender_balance;

  -- Credit receiver (70%)
  UPDATE public.profiles
    SET coin_balance = coin_balance + _earned,
        total_earned = total_earned + _earned
    WHERE id = _receiver_id
    RETURNING coin_balance INTO _receiver_balance;

  INSERT INTO public.gifts (sender_id, receiver_id, video_id, stream_id, gift_type, coin_amount)
  VALUES (_sender, _receiver_id, _video_id, _stream_id, _gift_type, _coin_amount);

  INSERT INTO public.coin_transactions (user_id, type, amount, balance_after, description)
  VALUES (_sender, 'gift_sent', -_coin_amount, _sender_balance, 'Sent a ' || _gift_type || ' gift');

  INSERT INTO public.coin_transactions (user_id, type, amount, balance_after, description)
  VALUES (_receiver_id, 'gift_received', _earned, _receiver_balance, 'Received a ' || _gift_type || ' gift');

  IF _stream_id IS NOT NULL THEN
    UPDATE public.live_streams SET total_gifts = total_gifts + 1 WHERE id = _stream_id;
  END IF;

  RETURN jsonb_build_object('sender_balance', _sender_balance, 'earned', _earned);
END;
$$;

-- ========== COUNTER TRIGGERS ==========
CREATE OR REPLACE FUNCTION public.bump_like_count()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.videos SET like_count = like_count + 1 WHERE id = NEW.video_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.videos SET like_count = GREATEST(like_count - 1, 0) WHERE id = OLD.video_id;
  END IF;
  RETURN NULL;
END;
$$;
CREATE TRIGGER trg_like_count AFTER INSERT OR DELETE ON public.likes FOR EACH ROW EXECUTE FUNCTION public.bump_like_count();

CREATE OR REPLACE FUNCTION public.bump_comment_count()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.videos SET comment_count = comment_count + 1 WHERE id = NEW.video_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.videos SET comment_count = GREATEST(comment_count - 1, 0) WHERE id = OLD.video_id;
  END IF;
  RETURN NULL;
END;
$$;
CREATE TRIGGER trg_comment_count AFTER INSERT OR DELETE ON public.comments FOR EACH ROW EXECUTE FUNCTION public.bump_comment_count();

CREATE OR REPLACE FUNCTION public.bump_application_count()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE public.campaigns SET application_count = application_count + 1 WHERE id = NEW.campaign_id;
  RETURN NULL;
END;
$$;
CREATE TRIGGER trg_application_count AFTER INSERT ON public.campaign_applications FOR EACH ROW EXECUTE FUNCTION public.bump_application_count();

-- ========== REALTIME ==========
ALTER PUBLICATION supabase_realtime ADD TABLE public.videos;
ALTER PUBLICATION supabase_realtime ADD TABLE public.live_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.live_streams;
