-- Criar tabela de log de atividades administrativas
CREATE TABLE IF NOT EXISTS public.admin_activity_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  action_type TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  entity_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.admin_activity_log ENABLE ROW LEVEL SECURITY;

-- Política para admins visualizarem atividades
CREATE POLICY "Admins can view activity logs"
ON public.admin_activity_log
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Política para admins excluírem atividades
CREATE POLICY "Admins can delete activity logs"
ON public.admin_activity_log
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Criar função para registrar atividade
CREATE OR REPLACE FUNCTION public.log_admin_activity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.admin_activity_log (action_type, entity_type, entity_id, entity_name)
  VALUES (
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    CASE 
      WHEN TG_TABLE_NAME = 'services' THEN COALESCE(NEW.title, OLD.title)
      WHEN TG_TABLE_NAME = 'case_studies' THEN COALESCE(NEW.title, OLD.title)
      WHEN TG_TABLE_NAME = 'testimonials' THEN COALESCE('Depoimento de ' || NEW.client_name, 'Depoimento de ' || OLD.client_name)
      WHEN TG_TABLE_NAME = 'certifications' THEN COALESCE(NEW.title, OLD.title)
      ELSE 'Item'
    END
  );
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Criar triggers para cada tabela
CREATE TRIGGER log_services_activity
AFTER INSERT OR UPDATE ON public.services
FOR EACH ROW
EXECUTE FUNCTION public.log_admin_activity();

CREATE TRIGGER log_case_studies_activity
AFTER INSERT OR UPDATE ON public.case_studies
FOR EACH ROW
EXECUTE FUNCTION public.log_admin_activity();

CREATE TRIGGER log_testimonials_activity
AFTER INSERT OR UPDATE ON public.testimonials
FOR EACH ROW
EXECUTE FUNCTION public.log_admin_activity();

CREATE TRIGGER log_certifications_activity
AFTER INSERT OR UPDATE ON public.certifications
FOR EACH ROW
EXECUTE FUNCTION public.log_admin_activity();

-- Criar índice para melhor performance
CREATE INDEX idx_admin_activity_log_created_at ON public.admin_activity_log(created_at DESC);