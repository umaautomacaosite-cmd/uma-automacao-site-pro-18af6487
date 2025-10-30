-- Add next_verification_at column to user_roles table
ALTER TABLE public.user_roles
ADD COLUMN next_verification_at timestamp with time zone;