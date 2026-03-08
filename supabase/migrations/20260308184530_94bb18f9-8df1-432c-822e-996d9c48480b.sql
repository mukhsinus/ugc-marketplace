
-- =============================================
-- UGC MARKET DATABASE SCHEMA
-- =============================================

-- Role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'creator', 'brand');

-- Category enum
CREATE TYPE public.content_category AS ENUM ('beauty', 'fashion', 'food', 'tech', 'lifestyle', 'fitness', 'education', 'travel');

-- Job status enum
CREATE TYPE public.job_status AS ENUM ('open', 'in_progress', 'completed', 'cancelled');

-- Proposal status enum
CREATE TYPE public.proposal_status AS ENUM ('pending', 'accepted', 'rejected');

-- Submission status enum
CREATE TYPE public.submission_status AS ENUM ('submitted', 'approved', 'revision_requested');

-- License type enum
CREATE TYPE public.license_type AS ENUM ('standard', 'extended', 'exclusive');

-- =============================================
-- TIMESTAMP TRIGGER FUNCTION
-- =============================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- =============================================
-- USER ROLES TABLE
-- =============================================
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can manage roles" ON public.user_roles
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- PROFILES TABLE
-- =============================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  name TEXT NOT NULL DEFAULT '',
  username TEXT UNIQUE,
  email TEXT NOT NULL DEFAULT '',
  role app_role NOT NULL DEFAULT 'creator',
  city TEXT,
  bio TEXT,
  categories content_category[] DEFAULT '{}',
  price_from NUMERIC(10,2),
  instagram_link TEXT,
  tiktok_link TEXT,
  youtube_link TEXT,
  avatar_url TEXT,
  rating NUMERIC(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  company_name TEXT,
  contact_name TEXT,
  website TEXT,
  industry TEXT,
  is_banned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update any profile" ON public.profiles
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _role app_role;
  _name TEXT;
BEGIN
  _role := COALESCE((NEW.raw_user_meta_data->>'role')::app_role, 'creator');
  _name := COALESCE(NEW.raw_user_meta_data->>'name', '');
  
  INSERT INTO public.profiles (user_id, email, name, role, company_name, contact_name)
  VALUES (
    NEW.id,
    NEW.email,
    _name,
    _role,
    CASE WHEN _role = 'brand' THEN _name ELSE NULL END,
    CASE WHEN _role = 'brand' THEN _name ELSE NULL END
  );
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, _role);
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- PORTFOLIO TABLE
-- =============================================
CREATE TABLE public.portfolio (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.portfolio ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Portfolio viewable by everyone" ON public.portfolio
  FOR SELECT USING (true);

CREATE POLICY "Creators can manage own portfolio" ON public.portfolio
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = portfolio.creator_id AND user_id = auth.uid())
  );

-- =============================================
-- JOBS TABLE
-- =============================================
CREATE TABLE public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  content_type TEXT,
  platform TEXT,
  budget_min NUMERIC(10,2),
  budget_max NUMERIC(10,2),
  videos_required INTEGER DEFAULT 1,
  deadline TIMESTAMPTZ,
  status job_status NOT NULL DEFAULT 'open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Jobs viewable by everyone" ON public.jobs
  FOR SELECT USING (true);

CREATE POLICY "Brands can create own jobs" ON public.jobs
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = jobs.brand_id AND user_id = auth.uid() AND role = 'brand')
  );

CREATE POLICY "Brands can update own jobs" ON public.jobs
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = jobs.brand_id AND user_id = auth.uid())
  );

CREATE POLICY "Admins can manage all jobs" ON public.jobs
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_jobs_updated_at
  BEFORE UPDATE ON public.jobs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- PROPOSALS TABLE
-- =============================================
CREATE TABLE public.proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE NOT NULL,
  creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  message TEXT,
  price_offer NUMERIC(10,2),
  delivery_time INTEGER,
  status proposal_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Creators can view own proposals" ON public.proposals
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = proposals.creator_id AND user_id = auth.uid())
  );

CREATE POLICY "Brands can view proposals for their jobs" ON public.proposals
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.jobs j
      JOIN public.profiles p ON p.id = j.brand_id
      WHERE j.id = proposals.job_id AND p.user_id = auth.uid()
    )
  );

CREATE POLICY "Creators can create proposals" ON public.proposals
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = proposals.creator_id AND user_id = auth.uid() AND role = 'creator')
  );

CREATE POLICY "Brands can update proposals for their jobs" ON public.proposals
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.jobs j
      JOIN public.profiles p ON p.id = j.brand_id
      WHERE j.id = proposals.job_id AND p.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all proposals" ON public.proposals
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_proposals_updated_at
  BEFORE UPDATE ON public.proposals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- MESSAGES TABLE
-- =============================================
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  text TEXT,
  attachments TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages for their jobs" ON public.messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.jobs j
      JOIN public.profiles p ON (p.id = j.brand_id OR EXISTS (
        SELECT 1 FROM public.proposals pr WHERE pr.job_id = j.id AND pr.creator_id = p.id AND pr.status = 'accepted'
      ))
      WHERE j.id = messages.job_id AND p.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can send messages in their jobs" ON public.messages
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = messages.sender_id AND user_id = auth.uid())
  );

-- =============================================
-- SUBMISSIONS TABLE
-- =============================================
CREATE TABLE public.submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE NOT NULL,
  creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  file_url TEXT NOT NULL,
  status submission_status NOT NULL DEFAULT 'submitted',
  feedback TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Creators can view own submissions" ON public.submissions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = submissions.creator_id AND user_id = auth.uid())
  );

CREATE POLICY "Brands can view submissions for their jobs" ON public.submissions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.jobs j
      JOIN public.profiles p ON p.id = j.brand_id
      WHERE j.id = submissions.job_id AND p.user_id = auth.uid()
    )
  );

CREATE POLICY "Creators can create submissions" ON public.submissions
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = submissions.creator_id AND user_id = auth.uid())
  );

CREATE POLICY "Brands can update submissions for their jobs" ON public.submissions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.jobs j
      JOIN public.profiles p ON p.id = j.brand_id
      WHERE j.id = submissions.job_id AND p.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all submissions" ON public.submissions
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_submissions_updated_at
  BEFORE UPDATE ON public.submissions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- REVIEWS TABLE
-- =============================================
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE NOT NULL,
  creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  brand_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviews viewable by everyone" ON public.reviews
  FOR SELECT USING (true);

CREATE POLICY "Brands can create reviews" ON public.reviews
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = reviews.brand_id AND user_id = auth.uid() AND role = 'brand')
  );

CREATE OR REPLACE FUNCTION public.update_creator_rating()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.profiles
  SET 
    rating = (SELECT ROUND(AVG(rating)::numeric, 2) FROM public.reviews WHERE creator_id = NEW.creator_id),
    review_count = (SELECT COUNT(*) FROM public.reviews WHERE creator_id = NEW.creator_id)
  WHERE id = NEW.creator_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_review_created
  AFTER INSERT ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_creator_rating();

-- =============================================
-- CONTENT LIBRARY TABLE
-- =============================================
CREATE TABLE public.content_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  category content_category NOT NULL,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  price NUMERIC(10,2) NOT NULL,
  license license_type NOT NULL DEFAULT 'standard',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.content_library ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active content viewable by everyone" ON public.content_library
  FOR SELECT USING (is_active = true OR EXISTS (
    SELECT 1 FROM public.profiles WHERE id = content_library.creator_id AND user_id = auth.uid()
  ));

CREATE POLICY "Creators can manage own content" ON public.content_library
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = content_library.creator_id AND user_id = auth.uid())
  );

CREATE POLICY "Admins can manage all content" ON public.content_library
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- PLATFORM SETTINGS TABLE
-- =============================================
CREATE TABLE public.platform_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read settings" ON public.platform_settings
  FOR SELECT USING (true);

CREATE POLICY "Only admins can update settings" ON public.platform_settings
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.platform_settings (key, value) VALUES ('commission_rate', '15');

-- =============================================
-- STORAGE BUCKETS
-- =============================================
INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio', 'portfolio', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('content', 'content', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('submissions', 'submissions', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('chat-attachments', 'chat-attachments', false);

CREATE POLICY "Portfolio files are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'portfolio');
CREATE POLICY "Users can upload portfolio files" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'portfolio' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete own portfolio files" ON storage.objects
  FOR DELETE USING (bucket_id = 'portfolio' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Content files are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'content');
CREATE POLICY "Users can upload content files" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'content' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete own content files" ON storage.objects
  FOR DELETE USING (bucket_id = 'content' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Submission files accessible to job participants" ON storage.objects
  FOR SELECT USING (bucket_id = 'submissions' AND auth.role() = 'authenticated');
CREATE POLICY "Users can upload submission files" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'submissions' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Avatar files are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Users can upload avatar files" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can update own avatar files" ON storage.objects
  FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Chat attachments accessible to authenticated" ON storage.objects
  FOR SELECT USING (bucket_id = 'chat-attachments' AND auth.role() = 'authenticated');
CREATE POLICY "Users can upload chat attachments" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'chat-attachments' AND auth.uid()::text = (storage.foldername(name))[1]);

-- =============================================
-- INDEXES
-- =============================================
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_profiles_categories ON public.profiles USING GIN(categories);
CREATE INDEX idx_profiles_city ON public.profiles(city);
CREATE INDEX idx_jobs_status ON public.jobs(status);
CREATE INDEX idx_jobs_brand_id ON public.jobs(brand_id);
CREATE INDEX idx_proposals_job_id ON public.proposals(job_id);
CREATE INDEX idx_proposals_creator_id ON public.proposals(creator_id);
CREATE INDEX idx_messages_job_id ON public.messages(job_id);
CREATE INDEX idx_content_library_category ON public.content_library(category);
CREATE INDEX idx_content_library_creator_id ON public.content_library(creator_id);

-- =============================================
-- REALTIME for messages
-- =============================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
