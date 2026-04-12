-- Add cover_image_url to recipes table
ALTER TABLE public.recipes 
ADD COLUMN IF NOT EXISTS cover_image_url TEXT,
ADD COLUMN IF NOT EXISTS description TEXT;

-- Create recipe_images table for gallery
CREATE TABLE IF NOT EXISTS public.recipe_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  recipe_id UUID NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  image_url TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on recipe_images
ALTER TABLE public.recipe_images ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for recipe_images
CREATE POLICY "Users can view own recipe images"
  ON public.recipe_images
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own recipe images"
  ON public.recipe_images
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own recipe images"
  ON public.recipe_images
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own recipe images"
  ON public.recipe_images
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create storage bucket for recipe images
INSERT INTO storage.buckets (id, name, public)
VALUES ('recipe-images', 'recipe-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for recipe-images bucket
CREATE POLICY "Anyone can view recipe images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'recipe-images');

CREATE POLICY "Authenticated users can upload recipe images"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'recipe-images' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update own recipe images storage"
  ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'recipe-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own recipe images storage"
  ON storage.objects
  FOR DELETE
  USING (bucket_id = 'recipe-images' AND auth.uid()::text = (storage.foldername(name))[1]);