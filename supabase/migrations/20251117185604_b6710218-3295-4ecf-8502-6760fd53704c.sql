-- Fix function search_path for security
-- Setting search_path to 'public' on functions that are missing it

-- Update check_contact_rate_limit function
CREATE OR REPLACE FUNCTION public.check_contact_rate_limit()
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Verificar se há mais de 5 mensagens na última hora
  RETURN (
    SELECT COUNT(*) < 5
    FROM contact_messages
    WHERE created_at > NOW() - INTERVAL '1 hour'
  );
END;
$function$;

-- Update generate_new_access_code function
CREATE OR REPLACE FUNCTION public.generate_new_access_code()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
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

-- Update check_and_renew_access_codes function
CREATE OR REPLACE FUNCTION public.check_and_renew_access_codes()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
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