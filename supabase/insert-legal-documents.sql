-- Desativar documentos legais antigos
UPDATE legal_documents SET is_active = false WHERE document_type IN ('terms_of_service', 'privacy_policy');

-- Inserir Termos de Uso atualizados
INSERT INTO legal_documents (
  document_type,
  version,
  title,
  content,
  effective_date,
  is_active
) VALUES (
  'terms_of_service',
  '1.0',
  'Termos de Uso',
  '<h2>1. Aceitação dos Termos</h2>
<p>Ao acessar e utilizar o site da UMA AUTOMAÇÃO, você concorda em cumprir e estar vinculado aos seguintes termos de uso. Se você não concordar com qualquer parte destes termos, não deverá utilizar nosso site.</p>

<h2>2. Uso do Site</h2>
<p>O conteúdo deste site é fornecido apenas para fins informativos. Você concorda em usar o site apenas para fins legais e de maneira que não infrinja os direitos de terceiros ou restrinja ou iniba o uso e aproveitamento do site por qualquer outra pessoa.</p>

<h3>É proibido:</h3>
<ul>
  <li>Utilizar o site de forma que cause danos ou prejudique sua disponibilidade ou acessibilidade;</li>
  <li>Utilizar o site para transmitir material malicioso ou tecnologicamente prejudicial;</li>
  <li>Tentar obter acesso não autorizado ao site, servidor ou banco de dados;</li>
  <li>Realizar ataques de negação de serviço ou ataques distribuídos de negação de serviço.</li>
</ul>

<h2>3. Propriedade Intelectual</h2>
<p>Todo o conteúdo incluído neste site, como textos, gráficos, logotipos, imagens, clipes de áudio, downloads digitais e compilações de dados, é propriedade da UMA AUTOMAÇÃO ou de seus fornecedores de conteúdo e está protegido por leis de direitos autorais brasileiras e internacionais.</p>

<h2>4. Serviços Oferecidos</h2>
<p>As informações sobre nossos serviços de automação industrial e predial são apresentadas de forma geral. Propostas comerciais específicas serão fornecidas mediante solicitação formal e análise técnica de cada projeto.</p>

<h2>5. Limitação de Responsabilidade</h2>
<p>A UMA AUTOMAÇÃO não será responsável por quaisquer danos diretos, indiretos, incidentais, consequenciais ou punitivos decorrentes do uso ou da incapacidade de usar este site ou qualquer conteúdo nele contido.</p>

<h2>6. Links para Sites de Terceiros</h2>
<p>Este site pode conter links para sites de terceiros. Estes links são fornecidos apenas para sua conveniência. A UMA AUTOMAÇÃO não tem controle sobre o conteúdo desses sites e não assume responsabilidade por eles.</p>

<h2>7. Modificações dos Termos</h2>
<p>A UMA AUTOMAÇÃO se reserva o direito de modificar estes termos de uso a qualquer momento. Recomendamos que você revise esta página periodicamente. O uso continuado do site após alterações constitui sua aceitação dos novos termos.</p>

<h2>8. Lei Aplicável</h2>
<p>Estes termos de uso são regidos pelas leis da República Federativa do Brasil. Qualquer disputa relacionada a estes termos estará sujeita à jurisdição exclusiva dos tribunais de Brasília, DF.</p>

<h2>9. Contato</h2>
<p>Se você tiver dúvidas sobre estes Termos de Uso, entre em contato conosco através da página de contato ou pelos canais disponibilizados no rodapé do site.</p>

<p><strong>Última atualização: Novembro de 2025</strong></p>',
  NOW(),
  true
);

-- Inserir Política de Privacidade atualizada
INSERT INTO legal_documents (
  document_type,
  version,
  title,
  content,
  effective_date,
  is_active
) VALUES (
  'privacy_policy',
  '1.0',
  'Política de Privacidade',
  '<p>A UMA AUTOMAÇÃO está comprometida em proteger a privacidade e os dados pessoais de seus visitantes e clientes. Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos suas informações em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).</p>

<h2>1. Informações que Coletamos</h2>
<p>Coletamos diferentes tipos de informações:</p>

<h3>1.1 Informações Fornecidas por Você</h3>
<ul>
  <li>Nome completo</li>
  <li>Endereço de e-mail</li>
  <li>Número de telefone</li>
  <li>Empresa/organização</li>
  <li>Mensagens e informações enviadas através de formulários de contato</li>
</ul>

<h3>1.2 Informações Coletadas Automaticamente</h3>
<ul>
  <li>Endereço IP</li>
  <li>Tipo de navegador e dispositivo</li>
  <li>Páginas visitadas e tempo de permanência</li>
  <li>Origem de acesso (referrer)</li>
  <li>Dados de interação com o site</li>
</ul>

<h2>2. Como Utilizamos suas Informações</h2>
<p>Utilizamos as informações coletadas para:</p>
<ul>
  <li>Responder a suas solicitações e fornecer informações sobre nossos serviços;</li>
  <li>Processar propostas comerciais e executar contratos;</li>
  <li>Enviar comunicações relacionadas aos serviços contratados;</li>
  <li>Melhorar nosso site e experiência do usuário;</li>
  <li>Realizar análises estatísticas e de mercado;</li>
  <li>Cumprir obrigações legais e regulatórias;</li>
  <li>Prevenir fraudes e garantir a segurança do site.</li>
</ul>

<h2>3. Cookies e Tecnologias Similares</h2>
<p>Utilizamos cookies e tecnologias similares para melhorar sua experiência. Você pode gerenciar suas preferências de cookies através do banner de consentimento exibido em sua primeira visita.</p>

<h3>3.1 Tipos de Cookies</h3>
<ul>
  <li><strong>Cookies Essenciais:</strong> Necessários para o funcionamento básico do site</li>
  <li><strong>Cookies Analíticos:</strong> Google Analytics para análise de tráfego e comportamento</li>
  <li><strong>Cookies de Marketing:</strong> Para personalização de conteúdo e campanhas</li>
</ul>

<h2>4. Compartilhamento de Informações</h2>
<p>Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros para fins de marketing. Podemos compartilhar informações apenas nas seguintes situações:</p>
<ul>
  <li>Com prestadores de serviços que nos auxiliam nas operações (ex: Google Analytics);</li>
  <li>Quando exigido por lei ou ordem judicial;</li>
  <li>Para proteger nossos direitos, propriedade ou segurança;</li>
  <li>Com seu consentimento explícito.</li>
</ul>

<h2>5. Armazenamento e Segurança</h2>
<p>Implementamos medidas técnicas e organizacionais adequadas para proteger suas informações pessoais contra acesso não autorizado, alteração, divulgação ou destruição. Isso inclui:</p>
<ul>
  <li>Criptografia de dados em trânsito (SSL/TLS);</li>
  <li>Controles de acesso restritos;</li>
  <li>Monitoramento de segurança;</li>
  <li>Backups regulares;</li>
  <li>Treinamento de equipe sobre proteção de dados.</li>
</ul>
<p>Seus dados são armazenados em servidores seguros e mantidos apenas pelo tempo necessário para cumprir as finalidades descritas nesta política ou conforme exigido por lei.</p>

<h2>6. Seus Direitos (LGPD)</h2>
<p>De acordo com a LGPD, você tem os seguintes direitos sobre seus dados pessoais:</p>
<ul>
  <li>Confirmação da existência de tratamento de dados;</li>
  <li>Acesso aos seus dados;</li>
  <li>Correção de dados incompletos, inexatos ou desatualizados;</li>
  <li>Anonimização, bloqueio ou eliminação de dados desnecessários;</li>
  <li>Portabilidade dos dados;</li>
  <li>Eliminação dos dados tratados com seu consentimento;</li>
  <li>Informação sobre compartilhamento de dados;</li>
  <li>Revogação do consentimento.</li>
</ul>
<p>Para exercer qualquer um desses direitos, entre em contato conosco através dos canais disponibilizados na seção de contato.</p>

<h2>7. Dados de Menores</h2>
<p>Nosso site não é direcionado a menores de 18 anos e não coletamos intencionalmente informações de menores. Se tomarmos conhecimento de que coletamos dados de um menor sem consentimento parental adequado, tomaremos medidas para remover essas informações.</p>

<h2>8. Google Analytics</h2>
<p>Utilizamos o Google Analytics para análise de tráfego e comportamento dos visitantes. O Google Analytics utiliza cookies para coletar informações sobre o uso do site. Essas informações são usadas para compilar relatórios e nos ajudar a melhorar o site. Os cookies coletam informações de forma anônima.</p>

<h2>9. Alterações nesta Política</h2>
<p>Podemos atualizar esta Política de Privacidade periodicamente. Recomendamos que você revise esta página regularmente para se manter informado sobre como protegemos suas informações. A data da última atualização será sempre indicada no final desta política.</p>

<h2>10. Encarregado de Dados (DPO)</h2>
<p>Para questões relacionadas à proteção de dados e exercício de seus direitos sob a LGPD, entre em contato através dos canais disponibilizados no rodapé do site.</p>

<h2>11. Contato</h2>
<p>Se você tiver dúvidas sobre esta Política de Privacidade ou sobre o tratamento de seus dados pessoais, entre em contato conosco através da página de contato ou pelos canais disponibilizados no rodapé do site.</p>

<p><strong>Última atualização: Novembro de 2025</strong></p>',
  NOW(),
  true
);
