-- Create settings table for system configurations
CREATE TABLE IF NOT EXISTS public.settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Admins can manage settings
CREATE POLICY "Admins can manage settings"
ON public.settings
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Anyone can view settings (for public display)
CREATE POLICY "Anyone can view settings"
ON public.settings
FOR SELECT
USING (true);

-- Create client_logos table for partner logos
CREATE TABLE IF NOT EXISTS public.client_logos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  logo_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.client_logos ENABLE ROW LEVEL SECURITY;

-- Admins can manage client logos
CREATE POLICY "Admins can manage client logos"
ON public.client_logos
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Anyone can view active client logos
CREATE POLICY "Anyone can view active client logos"
ON public.client_logos
FOR SELECT
USING (is_active = true);

-- Trigger for updated_at on settings
CREATE TRIGGER update_settings_updated_at
BEFORE UPDATE ON public.settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for updated_at on client_logos
CREATE TRIGGER update_client_logos_updated_at
BEFORE UPDATE ON public.client_logos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default settings
INSERT INTO public.settings (key, value) VALUES
  ('whatsapp_number', '5561999999999'),
  ('header_phone', '(61) 99999-9999'),
  ('footer_phone', '(61) 99999-9999'),
  ('header_email', 'contato@umaautomacao.com.br'),
  ('footer_email', 'contato@umaautomacao.com.br'),
  ('hero_image_url', ''),
  ('facebook_url', ''),
  ('instagram_url', ''),
  ('linkedin_url', '')
ON CONFLICT (key) DO NOTHING;