-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  display_name TEXT,
  preferred_temp_unit TEXT DEFAULT 'celsius',
  preferred_time_format TEXT DEFAULT '24h',
  theme TEXT DEFAULT 'light',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create recipes table
CREATE TABLE public.recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  flour_total_g INTEGER NOT NULL,
  water_g INTEGER NOT NULL,
  starter_g INTEGER NOT NULL,
  salt_g NUMERIC(5,1) NOT NULL,
  flour_breakdown JSONB DEFAULT '{"white": 100}',
  notes TEXT,
  is_sample BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bakes table
CREATE TABLE public.bakes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  recipe_id UUID REFERENCES public.recipes(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  room_temp_c INTEGER DEFAULT 24,
  starter_strength TEXT DEFAULT 'medium' CHECK (starter_strength IN ('weak', 'medium', 'strong')),
  folds_count INTEGER DEFAULT 4,
  bulk_target_hours NUMERIC(4,1) DEFAULT 4,
  cold_retard_hours NUMERIC(4,1) DEFAULT 12,
  status TEXT DEFAULT 'planned' CHECK (status IN ('planned', 'in_progress', 'completed', 'cancelled')),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  oven_temp_c INTEGER,
  steam_used BOOLEAN DEFAULT TRUE,
  covered_minutes INTEGER,
  uncovered_minutes INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bake_steps table
CREATE TABLE public.bake_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bake_id UUID REFERENCES public.bakes(id) ON DELETE CASCADE NOT NULL,
  step_type TEXT NOT NULL CHECK (step_type IN ('autolyse', 'mix', 'fold', 'bulk_ferment', 'shape', 'proof', 'cold_retard', 'bake_covered', 'bake_uncovered', 'cool')),
  title TEXT NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER,
  completed BOOLEAN DEFAULT FALSE,
  notes TEXT,
  sort_order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create starter_feeds table
CREATE TABLE public.starter_feeds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  fed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ratio TEXT DEFAULT '1:1:1',
  flour_g INTEGER NOT NULL,
  water_g INTEGER NOT NULL,
  temp_c INTEGER,
  height_before_cm NUMERIC(4,1),
  height_peak_cm NUMERIC(4,1),
  peak_after_hours NUMERIC(4,1),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create photos table
CREATE TABLE public.photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  bake_id UUID REFERENCES public.bakes(id) ON DELETE CASCADE,
  photo_type TEXT CHECK (photo_type IN ('before_bake', 'after_bake', 'crumb', 'other')),
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bakes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bake_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.starter_feeds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for recipes (users see own + sample recipes)
CREATE POLICY "Users can view own recipes" ON public.recipes FOR SELECT USING (auth.uid() = user_id OR is_sample = TRUE);
CREATE POLICY "Users can insert own recipes" ON public.recipes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own recipes" ON public.recipes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own recipes" ON public.recipes FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for bakes
CREATE POLICY "Users can view own bakes" ON public.bakes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own bakes" ON public.bakes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own bakes" ON public.bakes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own bakes" ON public.bakes FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for bake_steps
CREATE POLICY "Users can view own bake steps" ON public.bake_steps FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.bakes WHERE bakes.id = bake_steps.bake_id AND bakes.user_id = auth.uid())
);
CREATE POLICY "Users can insert own bake steps" ON public.bake_steps FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.bakes WHERE bakes.id = bake_steps.bake_id AND bakes.user_id = auth.uid())
);
CREATE POLICY "Users can update own bake steps" ON public.bake_steps FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.bakes WHERE bakes.id = bake_steps.bake_id AND bakes.user_id = auth.uid())
);
CREATE POLICY "Users can delete own bake steps" ON public.bake_steps FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.bakes WHERE bakes.id = bake_steps.bake_id AND bakes.user_id = auth.uid())
);

-- RLS Policies for starter_feeds
CREATE POLICY "Users can view own starter feeds" ON public.starter_feeds FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own starter feeds" ON public.starter_feeds FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own starter feeds" ON public.starter_feeds FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own starter feeds" ON public.starter_feeds FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for photos
CREATE POLICY "Users can view own photos" ON public.photos FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own photos" ON public.photos FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own photos" ON public.photos FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own photos" ON public.photos FOR DELETE USING (auth.uid() = user_id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_recipes_updated_at BEFORE UPDATE ON public.recipes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_bakes_updated_at BEFORE UPDATE ON public.bakes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for photos
INSERT INTO storage.buckets (id, name, public) VALUES ('bake-photos', 'bake-photos', true);

-- Storage policies
CREATE POLICY "Anyone can view bake photos" ON storage.objects FOR SELECT USING (bucket_id = 'bake-photos');
CREATE POLICY "Users can upload own photos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'bake-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can update own photos" ON storage.objects FOR UPDATE USING (bucket_id = 'bake-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete own photos" ON storage.objects FOR DELETE USING (bucket_id = 'bake-photos' AND auth.uid()::text = (storage.foldername(name))[1]);