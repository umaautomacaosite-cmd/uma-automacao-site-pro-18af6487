-- Add last_verified_at column to user_roles table to track weekly 2FA
ALTER TABLE public.user_roles 
ADD COLUMN last_verified_at TIMESTAMP WITH TIME ZONE;