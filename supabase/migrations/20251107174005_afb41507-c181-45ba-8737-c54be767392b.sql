-- Adicionar campos para About na HOME (settings)
INSERT INTO public.settings (key, value) VALUES
  ('home_about', 'Sobre nós texto para HOME')
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.settings (key, value) VALUES
  ('home_mission', 'Nossa missão texto para HOME')
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.settings (key, value) VALUES
  ('home_vision', 'Nossa visão texto para HOME')
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.settings (key, value) VALUES
  ('home_values', 'Nossos valores texto para HOME')
ON CONFLICT (key) DO NOTHING;

-- Adicionar campo is_featured nos serviços
ALTER TABLE public.services
ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false;

-- Criar tabela para estatísticas editáveis da HOME
CREATE TABLE IF NOT EXISTS public.home_stats (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  label text NOT NULL,
  value text NOT NULL,
  icon text NOT NULL DEFAULT 'Award',
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- RLS para home_stats
ALTER TABLE public.home_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage home stats" ON public.home_stats
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view active home stats" ON public.home_stats
  FOR SELECT USING (is_active = true);

-- Adicionar campo para imagem na tabela about_content
ALTER TABLE public.about_content
ADD COLUMN IF NOT EXISTS image_url text;

-- Inserir estatísticas padrão
INSERT INTO public.home_stats (label, value, icon, display_order) VALUES
  ('Projetos Entregues', '1500+', 'Award', 0),
  ('Anos de Experiência', '25+', 'Users', 1),
  ('Atendimento Nacional', '100%', 'MapPin', 2),
  ('Suporte Técnico', '24/7', 'Shield', 3)
ON CONFLICT DO NOTHING;