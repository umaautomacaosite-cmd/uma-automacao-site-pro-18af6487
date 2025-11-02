-- Adicionar coluna icon_fallback na tabela client_logos
ALTER TABLE public.client_logos 
ADD COLUMN IF NOT EXISTS icon_fallback TEXT DEFAULT 'Building2';