-- Create about_content table for managing main content sections
CREATE TABLE public.about_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section_key TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create about_values table
CREATE TABLE public.about_values (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  icon TEXT NOT NULL DEFAULT 'Target',
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create about_timeline table
CREATE TABLE public.about_timeline (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  year TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create about_stats table
CREATE TABLE public.about_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  value TEXT NOT NULL,
  label TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.about_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_stats ENABLE ROW LEVEL SECURITY;

-- Policies for about_content
CREATE POLICY "Anyone can view active about content"
  ON public.about_content FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage about content"
  ON public.about_content FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Policies for about_values
CREATE POLICY "Anyone can view active about values"
  ON public.about_values FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage about values"
  ON public.about_values FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Policies for about_timeline
CREATE POLICY "Anyone can view active about timeline"
  ON public.about_timeline FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage about timeline"
  ON public.about_timeline FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Policies for about_stats
CREATE POLICY "Anyone can view active about stats"
  ON public.about_stats FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage about stats"
  ON public.about_stats FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Add triggers for updated_at
CREATE TRIGGER update_about_content_updated_at
  BEFORE UPDATE ON public.about_content
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_about_values_updated_at
  BEFORE UPDATE ON public.about_values
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_about_timeline_updated_at
  BEFORE UPDATE ON public.about_timeline
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_about_stats_updated_at
  BEFORE UPDATE ON public.about_stats
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial data for about_content
INSERT INTO public.about_content (section_key, title, content, display_order) VALUES
  ('hero_title', 'Sobre a UMA AUTOMAÇÃO', 'Sobre a UMA AUTOMAÇÃO', 0),
  ('hero_subtitle', 'Subtítulo Hero', 'Mais de 15 anos de experiência em soluções de automação industrial, com engenheiros certificados CREA e comprometimento total com a excelência técnica.', 1),
  ('history_title', 'Nossa História', 'Nossa História', 2),
  ('history_p1', 'História Parágrafo 1', 'Fundada em 2008, a UMA AUTOMAÇÃO nasceu com o propósito de fornecer soluções técnicas de excelência em automação industrial para empresas de todos os portes. Nossa trajetória é marcada pela constante busca por inovação e qualidade.', 3),
  ('history_p2', 'História Parágrafo 2', 'Com uma equipe de engenheiros certificados CREA e técnicos especializados, desenvolvemos projetos que atendem rigorosamente às normas regulamentadoras NR-10, NR-12 e padrões internacionais ISO.', 4),
  ('mission', 'Missão', 'Fornecer soluções em automação industrial com excelência técnica, garantindo segurança, eficiência e conformidade às normas regulamentadoras.', 5),
  ('vision', 'Visão', 'Ser a empresa de referência em automação industrial no Brasil, reconhecida pela qualidade técnica e inovação.', 6),
  ('values_summary', 'Valores', 'Ética, transparência, qualidade técnica, segurança no trabalho e comprometimento com resultados.', 7);

-- Insert initial data for about_values
INSERT INTO public.about_values (icon, title, description, display_order) VALUES
  ('Target', 'Excelência Técnica', 'Comprometimento com a qualidade e inovação em cada projeto entregue.', 0),
  ('Users', 'Equipe Especializada', 'Engenheiros certificados CREA com vasta experiência em automação industrial.', 1),
  ('CheckCircle', 'Conformidade Total', 'Aderência rigorosa às normas NRs, ISO e padrões internacionais.', 2),
  ('Heart', 'Relacionamento Duradouro', 'Parceria de longo prazo com nossos clientes e suporte contínuo.', 3);

-- Insert initial data for about_timeline
INSERT INTO public.about_timeline (year, title, description, display_order) VALUES
  ('2008', 'Fundação da Empresa', 'Início das atividades com foco em automação industrial.', 0),
  ('2012', 'Certificação ISO 9001', 'Primeira certificação de qualidade conquistada.', 1),
  ('2015', 'Expansão Nacional', 'Início do atendimento em todo território nacional.', 2),
  ('2018', '1500+ Projetos', 'Marco de 1500 projetos entregues com sucesso.', 3),
  ('2020', 'Tecnologia Digital', 'Incorporação de tecnologias Industry 4.0.', 4),
  ('2024', 'Líder de Mercado', 'Reconhecimento como referência em automação industrial.', 5);

-- Insert initial data for about_stats
INSERT INTO public.about_stats (value, label, display_order) VALUES
  ('1500+', 'Projetos Entregues', 0),
  ('25+', 'Anos de Experiência', 1);