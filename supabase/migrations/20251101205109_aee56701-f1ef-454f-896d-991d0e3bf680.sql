-- Adicionar campo de imagem de capa para cases
ALTER TABLE public.case_studies 
ADD COLUMN IF NOT EXISTS cover_image_url text;

-- Atualizar função de geração de código de acesso para 15 minutos
CREATE OR REPLACE FUNCTION public.generate_new_access_code()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  new_code TEXT;
  expiry_date TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Gerar código aleatório de 8 caracteres
  new_code := upper(substring(md5(random()::text) from 1 for 8));
  
  -- Definir expiração para 15 minutos a partir de agora
  expiry_date := now() + interval '15 minutes';
  
  -- Inserir novo código
  INSERT INTO public.access_codes (code, expires_at, used, user_id)
  VALUES (new_code, expiry_date, false, auth.uid());
END;
$function$;

-- Atualizar função de renovação de códigos para 15 minutos
CREATE OR REPLACE FUNCTION public.check_and_renew_access_codes()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  -- Para cada código expirado não usado, gerar um novo
  INSERT INTO public.access_codes (code, expires_at, used, user_id)
  SELECT 
    upper(substring(md5(random()::text) from 1 for 8)),
    now() + interval '15 minutes',
    false,
    user_id
  FROM public.access_codes
  WHERE expires_at < now() AND used = false;
  
  -- Marcar códigos expirados como usados
  UPDATE public.access_codes
  SET used = true
  WHERE expires_at < now() AND used = false;
END;
$function$;