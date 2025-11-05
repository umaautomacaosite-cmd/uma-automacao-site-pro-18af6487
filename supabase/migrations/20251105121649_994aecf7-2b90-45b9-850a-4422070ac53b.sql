-- Add website_url column to client_logos table
ALTER TABLE public.client_logos
ADD COLUMN website_url text;

COMMENT ON COLUMN public.client_logos.website_url IS 'URL do website do parceiro (opcional)';