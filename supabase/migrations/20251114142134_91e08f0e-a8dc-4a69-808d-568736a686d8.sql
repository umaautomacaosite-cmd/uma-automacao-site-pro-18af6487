-- Inserir configurações padrão na tabela settings
INSERT INTO public.settings (key, value) VALUES
  ('hero_title', 'Soluções em Automação Predial e Infraestrutura de Alta Performance'),
  ('hero_subtitle', 'Atendimento em todo o território nacional, com engenheiros certificados CREA e compliance com normas NRs, ISO 9001 e ABNT.'),
  ('hero_description', 'Mais de 15 anos de experiência em projetos de automação predial, infraestrutura de TI e telecomunicações para empresas de médio e grande porte.'),
  ('hero_image_url', '/src/assets/datacenter-hero.jpg'),
  ('header_phone', '(61) 99999-9999'),
  ('header_email', 'contato@umaautomacao.com.br'),
  ('footer_phone', '(61) 99999-9999'),
  ('footer_email', 'contato@umaautomacao.com.br'),
  ('whatsapp_number', '5561999999999'),
  ('facebook_url', ''),
  ('instagram_url', ''),
  ('linkedin_url', ''),
  ('cnpj', '')
ON CONFLICT (key) DO NOTHING;

-- Inserir documentos legais iniciais
INSERT INTO public.legal_documents (document_type, version, title, content, effective_date, is_active)
VALUES (
  'terms_of_service',
  '1.0',
  'Termos de Uso do Site',
  '<h2>1. Aceitação dos Termos</h2><p>Ao acessar e usar este site, você aceita e concorda em cumprir estes Termos de Uso.</p><h2>2. Uso do Site</h2><p>Este site destina-se a fornecer informações sobre nossos serviços de automação industrial.</p><h2>3. Propriedade Intelectual</h2><p>Todo o conteúdo deste site é propriedade da UMA Automação e está protegido por leis de direitos autorais.</p><h2>4. Limitação de Responsabilidade</h2><p>Não nos responsabilizamos por danos decorrentes do uso deste site.</p><h2>5. Modificações</h2><p>Reservamos o direito de modificar estes termos a qualquer momento.</p>',
  NOW(),
  true
),
(
  'privacy_policy',
  '1.0',
  'Política de Privacidade',
  '<h2>1. Coleta de Dados</h2><p>Coletamos dados pessoais como nome, e-mail, telefone e empresa quando você nos contata através do formulário.</p><h2>2. Uso dos Dados</h2><p>Seus dados são utilizados exclusivamente para responder suas solicitações e melhorar nossos serviços.</p><h2>3. Cookies</h2><p>Utilizamos cookies essenciais, de analytics (Google Analytics) e marketing. Você pode gerenciar suas preferências através do banner de cookies.</p><h2>4. Compartilhamento</h2><p>Não compartilhamos seus dados com terceiros, exceto quando necessário para prestação de serviços (ex: Google Analytics).</p><h2>5. Seus Direitos (LGPD)</h2><p>Você tem direito de acessar, corrigir, excluir ou exportar seus dados. Entre em contato conosco para exercer seus direitos.</p><h2>6. Segurança</h2><p>Implementamos medidas técnicas e organizacionais para proteger seus dados.</p><h2>7. Contato</h2><p>Para questões sobre privacidade: contato@umaautomacao.com.br</p>',
  NOW(),
  true
)
ON CONFLICT DO NOTHING;