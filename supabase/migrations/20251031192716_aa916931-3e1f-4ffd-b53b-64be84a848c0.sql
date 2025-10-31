-- Adicionar colunas para cores separadas de ícones
ALTER TABLE public.services 
ADD COLUMN applications_icon_color text DEFAULT 'green',
ADD COLUMN features_icon_color text DEFAULT 'red';

-- Migrar dados existentes baseados no icon_type atual
UPDATE public.services 
SET applications_icon_color = icon_type,
    features_icon_color = icon_type;

-- Remover a coluna antiga após migração (opcional, mas recomendado)
ALTER TABLE public.services DROP COLUMN icon_type;