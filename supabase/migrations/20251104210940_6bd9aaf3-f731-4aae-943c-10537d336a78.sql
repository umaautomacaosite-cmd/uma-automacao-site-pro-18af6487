-- Create contact_info table
CREATE TABLE public.contact_info (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  phone text NOT NULL,
  email text NOT NULL,
  address text NOT NULL,
  business_hours jsonb NOT NULL DEFAULT '[]'::jsonb,
  map_latitude numeric,
  map_longitude numeric,
  map_embed_url text,
  whatsapp_number text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create contact_messages table
CREATE TABLE public.contact_messages (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  company text,
  service_type text NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'novo',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.contact_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for contact_info
CREATE POLICY "Anyone can view contact info"
  ON public.contact_info
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage contact info"
  ON public.contact_info
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for contact_messages
CREATE POLICY "Anyone can insert messages"
  ON public.contact_messages
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view all messages"
  ON public.contact_messages
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update messages"
  ON public.contact_messages
  FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete messages"
  ON public.contact_messages
  FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Create triggers for updated_at
CREATE TRIGGER update_contact_info_updated_at
  BEFORE UPDATE ON public.contact_info
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_contact_messages_updated_at
  BEFORE UPDATE ON public.contact_messages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial contact info
INSERT INTO public.contact_info (
  phone,
  email,
  address,
  business_hours,
  whatsapp_number,
  map_embed_url
) VALUES (
  '(61) 99999-9999',
  'contato@umaautomacao.com.br',
  'Av. Paulista, 1000 - Sala 1501, Brasília, DF - CEP: 01310-100',
  '[
    {"day": "Segunda a Sexta", "hours": "7h às 17h"},
    {"day": "Sábado", "hours": "8h às 12h"}
  ]'::jsonb,
  '5511999999999',
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.0977!2d-47.8825!3d-15.7942!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTXCsDQ3JzM5LjEiUyA0N8KwNTInNTcuMCJX!5e0!3m2!1spt-BR!2sbr!4v1234567890'
);