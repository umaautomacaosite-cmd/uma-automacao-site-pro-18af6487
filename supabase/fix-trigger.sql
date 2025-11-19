-- Corrigir função de log de atividades para evitar erros com campos inexistentes
CREATE OR REPLACE FUNCTION public.log_admin_activity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  entity_name_value TEXT;
BEGIN
  -- Determinar o nome da entidade baseado na tabela e operação
  CASE TG_TABLE_NAME
    WHEN 'services' THEN
      entity_name_value := COALESCE(NEW.title, OLD.title);
    WHEN 'case_studies' THEN
      entity_name_value := COALESCE(NEW.title, OLD.title);
    WHEN 'testimonials' THEN
      entity_name_value := COALESCE(
        CASE WHEN NEW IS NOT NULL THEN 'Depoimento de ' || NEW.client_name ELSE NULL END,
        CASE WHEN OLD IS NOT NULL THEN 'Depoimento de ' || OLD.client_name ELSE NULL END
      );
    WHEN 'certifications' THEN
      entity_name_value := COALESCE(NEW.title, OLD.title);
    ELSE
      entity_name_value := 'Item';
  END CASE;

  -- Inserir registro de atividade
  INSERT INTO public.admin_activity_log (action_type, entity_type, entity_id, entity_name)
  VALUES (
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    entity_name_value
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$;
