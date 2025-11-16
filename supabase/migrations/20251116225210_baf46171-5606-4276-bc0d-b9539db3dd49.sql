-- Permitir que usuários anônimos possam ler configurações públicas da tabela settings
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