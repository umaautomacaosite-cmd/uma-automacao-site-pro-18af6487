-- Remove unused columns from services table
ALTER TABLE public.services DROP COLUMN IF EXISTS engineer;
ALTER TABLE public.services DROP COLUMN IF EXISTS display_order;