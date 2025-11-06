-- Create certifications table
CREATE TABLE public.certifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'Shield',
  icon_color TEXT NOT NULL DEFAULT 'text-blue-400',
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create testimonials table
CREATE TABLE public.testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT NOT NULL,
  company TEXT NOT NULL,
  testimonial TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5,
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on certifications
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;

-- RLS policies for certifications
CREATE POLICY "Anyone can view active certifications"
ON public.certifications
FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage certifications"
ON public.certifications
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Enable RLS on testimonials
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- RLS policies for testimonials
CREATE POLICY "Anyone can view active testimonials"
ON public.testimonials
FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage testimonials"
ON public.testimonials
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add triggers for updated_at
CREATE TRIGGER update_certifications_updated_at
BEFORE UPDATE ON public.certifications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_testimonials_updated_at
BEFORE UPDATE ON public.testimonials
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default settings for Hero section
INSERT INTO public.settings (key, value) VALUES
  ('hero_title', 'Soluções em Automação Predial e Infraestrutura de Alta Performance'),
  ('hero_subtitle', 'Atendimento em todo o território nacional, com engenheiros certificados CREA e compliance com normas NRs, ISO 9001 e ABNT.'),
  ('hero_description', 'Mais de 15 anos de experiência em projetos de automação predial, infraestrutura de TI e telecomunicações para empresas de médio e grande porte.'),
  ('testimonials_section_visible', 'true')
ON CONFLICT (key) DO NOTHING;

-- Insert default certifications
INSERT INTO public.certifications (title, description, icon, icon_color, display_order) VALUES
  ('CREA/DF', 'Engenheiros certificados pelo Conselho Regional de Engenharia e Agronomia', 'Shield', 'text-blue-400', 1),
  ('ISO 9001', 'Certificação de Sistema de Gestão da Qualidade', 'Award', 'text-gold-500', 2),
  ('NR-10', 'Segurança em Instalações e Serviços em Eletricidade', 'Zap', 'text-yellow-400', 3),
  ('NR-12', 'Segurança no Trabalho em Máquinas e Equipamentos', 'Settings', 'text-green-400', 4);

-- Insert default testimonials
INSERT INTO public.testimonials (client_name, company, testimonial, rating, display_order) VALUES
  ('Carlos Silva', 'Indústria ABC', 'Excelente trabalho! A automação implementada aumentou nossa eficiência em 40% e reduziu custos operacionais significativamente.', 5, 1),
  ('Maria Santos', 'Empresa XYZ', 'Profissionais altamente capacitados e comprometidos. O projeto foi entregue no prazo e superou nossas expectativas.', 5, 2),
  ('João Oliveira', 'Tech Solutions', 'A qualidade do serviço prestado é incomparável. Recomendo fortemente para qualquer empresa que busca excelência em automação.', 5, 3);