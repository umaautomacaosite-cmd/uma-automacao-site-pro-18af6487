-- Adicionar mensagem padrão do WhatsApp nas configurações públicas
INSERT INTO public.settings (key, value)
VALUES ('whatsapp_default_message', 'Olá! Gostaria de falar com um especialista em automação predial.')
ON CONFLICT (key) DO NOTHING;

-- Atualizar a política RLS para incluir a nova configuração
DROP POLICY IF EXISTS "Public can view public settings" ON public.settings;

CREATE POLICY "Public can view public settings"
ON public.settings
FOR SELECT
TO anon
USING (
  key IN (
    'hero_image_url',
    'hero_title', 
    'hero_subtitle',
    'hero_description',
    'header_phone',
    'header_email',
    'footer_phone',
    'footer_email',
    'whatsapp_number',
    'whatsapp_default_message',
    'facebook_url',
    'instagram_url',
    'linkedin_url',
    'cnpj',
    'home_about',
    'home_mission',
    'home_vision',
    'home_values',
    'testimonials_section_visible'
  )
);