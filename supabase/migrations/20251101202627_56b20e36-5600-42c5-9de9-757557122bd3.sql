-- Criar bucket para imagens de case studies
INSERT INTO storage.buckets (id, name, public)
VALUES ('case-study-images', 'case-study-images', true)
ON CONFLICT (id) DO NOTHING;

-- Criar tabela para múltiplas imagens de case studies
CREATE TABLE IF NOT EXISTS public.case_study_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_study_id UUID NOT NULL REFERENCES public.case_studies(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  description TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitar RLS na tabela case_study_images
ALTER TABLE public.case_study_images ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para case_study_images
CREATE POLICY "Anyone can view case study images"
ON public.case_study_images
FOR SELECT
USING (true);

CREATE POLICY "Admins can manage case study images"
ON public.case_study_images
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Políticas de storage para case-study-images bucket
CREATE POLICY "Public can view case study images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'case-study-images');

CREATE POLICY "Admins can upload case study images"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'case-study-images' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can update case study images"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'case-study-images' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can delete case study images"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'case-study-images' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Remover coluna category e solution da tabela case_studies
ALTER TABLE public.case_studies DROP COLUMN IF EXISTS category;
ALTER TABLE public.case_studies DROP COLUMN IF EXISTS solution;

-- Trigger para atualizar updated_at em case_study_images
CREATE TRIGGER update_case_study_images_updated_at
BEFORE UPDATE ON public.case_study_images
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Função para gerar código de acesso automaticamente quando expira
CREATE OR REPLACE FUNCTION public.generate_new_access_code()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_code TEXT;
  expiry_date TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Gerar código aleatório de 8 caracteres
  new_code := upper(substring(md5(random()::text) from 1 for 8));
  
  -- Definir expiração para 30 dias a partir de agora
  expiry_date := now() + interval '30 days';
  
  -- Inserir novo código
  INSERT INTO public.access_codes (code, expires_at, used, user_id)
  VALUES (new_code, expiry_date, false, auth.uid());
END;
$$;

-- Trigger para verificar códigos expirados e gerar novos automaticamente
CREATE OR REPLACE FUNCTION public.check_and_renew_access_codes()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Para cada código expirado não usado, gerar um novo
  INSERT INTO public.access_codes (code, expires_at, used, user_id)
  SELECT 
    upper(substring(md5(random()::text) from 1 for 8)),
    now() + interval '30 days',
    false,
    user_id
  FROM public.access_codes
  WHERE expires_at < now() AND used = false;
  
  -- Marcar códigos expirados como usados
  UPDATE public.access_codes
  SET used = true
  WHERE expires_at < now() AND used = false;
END;
$$;