-- Create case_studies table
CREATE TABLE public.case_studies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  title TEXT NOT NULL,
  client TEXT NOT NULL,
  sector TEXT NOT NULL,
  year TEXT NOT NULL,
  location TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'Building',
  solution TEXT NOT NULL,
  description TEXT NOT NULL,
  technologies JSONB DEFAULT '[]'::jsonb,
  standards JSONB DEFAULT '[]'::jsonb,
  results JSONB DEFAULT '[]'::jsonb,
  image_url TEXT,
  category TEXT NOT NULL DEFAULT 'Geral',
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true
);

-- Enable Row Level Security
ALTER TABLE public.case_studies ENABLE ROW LEVEL SECURITY;

-- Create policies for case_studies
CREATE POLICY "Anyone can view active case studies"
ON public.case_studies
FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage case studies"
ON public.case_studies
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_case_studies_updated_at
BEFORE UPDATE ON public.case_studies
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();