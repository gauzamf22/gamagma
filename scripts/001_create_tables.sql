-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'student', -- 'student', 'admin', 'alumni'
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create contact_persons table for gugus information
CREATE TABLE IF NOT EXISTS public.contact_persons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL, -- 'Gugus PIONIR', 'Co-Fasilitator'
  whatsapp TEXT,
  location TEXT,
  photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create track_records table for alumni achievements
CREATE TABLE IF NOT EXISTS public.track_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_name TEXT NOT NULL,
  year TEXT NOT NULL,
  program TEXT NOT NULL, -- e.g., 'SNBP', 'SNBT', 'Mandiri'
  faculty TEXT NOT NULL,
  major TEXT NOT NULL,
  photo_url TEXT,
  achievements TEXT[], -- Array of achievements
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create alumni_journals table
CREATE TABLE IF NOT EXISTS public.alumni_journals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL, -- e.g., 'Academic', 'Campus Life', 'Tips'
  cover_image_url TEXT,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create quiz_questions table
CREATE TABLE IF NOT EXISTS public.quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  options JSONB NOT NULL, -- Array of options with text and correct flag
  correct_answer TEXT NOT NULL,
  explanation TEXT,
  category TEXT NOT NULL, -- e.g., 'UGM History', 'Academics', 'Campus Life'
  difficulty TEXT NOT NULL DEFAULT 'easy', -- 'easy', 'medium', 'hard'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create quiz_results table
CREATE TABLE IF NOT EXISTS public.quiz_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create faculties table
CREATE TABLE IF NOT EXISTS public.faculties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  website_url TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create majors table
CREATE TABLE IF NOT EXISTS public.majors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  faculty_id UUID REFERENCES public.faculties(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  degree TEXT NOT NULL, -- 'S1', 'S2', 'S3', 'Diploma'
  accreditation TEXT,
  description TEXT,
  career_prospects TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_persons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.track_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alumni_journals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.majors ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "profiles_select_all" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for contact_persons (public read, admin write)
CREATE POLICY "contact_persons_select_all" ON public.contact_persons FOR SELECT USING (true);
CREATE POLICY "contact_persons_insert_admin" ON public.contact_persons FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "contact_persons_update_admin" ON public.contact_persons FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "contact_persons_delete_admin" ON public.contact_persons FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- RLS Policies for track_records (public read, admin write)
CREATE POLICY "track_records_select_all" ON public.track_records FOR SELECT USING (true);
CREATE POLICY "track_records_insert_admin" ON public.track_records FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "track_records_update_admin" ON public.track_records FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "track_records_delete_admin" ON public.track_records FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- RLS Policies for alumni_journals
CREATE POLICY "alumni_journals_select_all" ON public.alumni_journals FOR SELECT USING (true);
CREATE POLICY "alumni_journals_insert_own" ON public.alumni_journals FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "alumni_journals_update_own" ON public.alumni_journals FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "alumni_journals_delete_own" ON public.alumni_journals FOR DELETE USING (auth.uid() = author_id);

-- RLS Policies for quiz_questions (public read, admin write)
CREATE POLICY "quiz_questions_select_all" ON public.quiz_questions FOR SELECT USING (true);
CREATE POLICY "quiz_questions_insert_admin" ON public.quiz_questions FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- RLS Policies for quiz_results
CREATE POLICY "quiz_results_select_own" ON public.quiz_results FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "quiz_results_insert_own" ON public.quiz_results FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for faculties (public read, admin write)
CREATE POLICY "faculties_select_all" ON public.faculties FOR SELECT USING (true);
CREATE POLICY "faculties_insert_admin" ON public.faculties FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- RLS Policies for majors (public read, admin write)
CREATE POLICY "majors_select_all" ON public.majors FOR SELECT USING (true);
CREATE POLICY "majors_insert_admin" ON public.majors FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
