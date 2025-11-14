import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';

const PrivacyPolicy = () => {
  return (
    <>
      <SEO 
        title="Política de Privacidade - UMA AUTOMAÇÃO"
        description="Política de privacidade e proteção de dados da UMA AUTOMAÇÃO, em conformidade com a LGPD."
        canonical="/politica-de-privacidade"
      />
      <Header />
      <main className="min-h-screen bg-background py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-playfair font-bold mb-8">Política de Privacidade</h1>
          
          <div className="space-y-6 text-muted-foreground">
            <section>
              <p className="mb-4">
                A UMA AUTOMAÇÃO está comprometida em proteger a privacidade e os dados pessoais de seus 
                visitantes e clientes. Esta Política de Privacidade descreve como coletamos, usamos, 
                armazenamos e protegemos suas informações em conformidade com a Lei Geral de Proteção de 
                Dados (LGPD - Lei nº 13.709/2018).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">1. Informações que Coletamos</h2>
              <p className="mb-2">Coletamos diferentes tipos de informações:</p>
              
              <h3 className="text-lg font-semibold text-foreground mt-4 mb-2">1.1 Informações Fornecidas por Você</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Nome completo</li>
                <li>Endereço de e-mail</li>
                <li>Número de telefone</li>
                <li>Empresa/organização</li>
                <li>Mensagens e informações enviadas através de formulários de contato</li>
              </ul>

              <h3 className="text-lg font-semibold text-foreground mt-4 mb-2">1.2 Informações Coletadas Automaticamente</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Endereço IP</li>
                <li>Tipo de navegador e dispositivo</li>
                <li>Páginas visitadas e tempo de permanência</li>
                <li>Origem de acesso (referrer)</li>
                <li>Dados de interação com o site</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">2. Como Utilizamos suas Informações</h2>
              <p className="mb-2">Utilizamos as informações coletadas para:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Responder a suas solicitações e fornecer informações sobre nossos serviços;</li>
                <li>Processar propostas comerciais e executar contratos;</li>
                <li>Enviar comunicações relacionadas aos serviços contratados;</li>
                <li>Melhorar nosso site e experiência do usuário;</li>
                <li>Realizar análises estatísticas e de mercado;</li>
                <li>Cumprir obrigações legais e regulatórias;</li>
                <li>Prevenir fraudes e garantir a segurança do site.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">3. Cookies e Tecnologias Similares</h2>
              <p className="mb-2">
                Utilizamos cookies e tecnologias similares para melhorar sua experiência. Você pode gerenciar 
                suas preferências de cookies através do banner de consentimento exibido em sua primeira visita.
              </p>
              
              <h3 className="text-lg font-semibold text-foreground mt-4 mb-2">3.1 Tipos de Cookies</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Cookies Essenciais:</strong> Necessários para o funcionamento básico do site
                </li>
                <li>
                  <strong>Cookies Analíticos:</strong> Google Analytics para análise de tráfego e comportamento
                </li>
                <li>
                  <strong>Cookies de Marketing:</strong> Para personalização de conteúdo e campanhas
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">4. Compartilhamento de Informações</h2>
              <p className="mb-2">
                Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros para fins de 
                marketing. Podemos compartilhar informações apenas nas seguintes situações:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Com prestadores de serviços que nos auxiliam nas operações (ex: Google Analytics);</li>
                <li>Quando exigido por lei ou ordem judicial;</li>
                <li>Para proteger nossos direitos, propriedade ou segurança;</li>
                <li>Com seu consentimento explícito.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">5. Armazenamento e Segurança</h2>
              <p className="mb-2">
                Implementamos medidas técnicas e organizacionais adequadas para proteger suas informações 
                pessoais contra acesso não autorizado, alteração, divulgação ou destruição. Isso inclui:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Criptografia de dados em trânsito (SSL/TLS);</li>
                <li>Controles de acesso restritos;</li>
                <li>Monitoramento de segurança;</li>
                <li>Backups regulares;</li>
                <li>Treinamento de equipe sobre proteção de dados.</li>
              </ul>
              <p className="mt-2">
                Seus dados são armazenados em servidores seguros e mantidos apenas pelo tempo necessário 
                para cumprir as finalidades descritas nesta política ou conforme exigido por lei.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">6. Seus Direitos (LGPD)</h2>
              <p className="mb-2">
                De acordo com a LGPD, você tem os seguintes direitos sobre seus dados pessoais:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Confirmação da existência de tratamento de dados;</li>
                <li>Acesso aos seus dados;</li>
                <li>Correção de dados incompletos, inexatos ou desatualizados;</li>
                <li>Anonimização, bloqueio ou eliminação de dados desnecessários;</li>
                <li>Portabilidade dos dados;</li>
                <li>Eliminação dos dados tratados com seu consentimento;</li>
                <li>Informação sobre compartilhamento de dados;</li>
                <li>Revogação do consentimento.</li>
              </ul>
              <p className="mt-2">
                Para exercer qualquer um desses direitos, entre em contato conosco através dos canais 
                disponibilizados na seção de contato.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">7. Dados de Menores</h2>
              <p>
                Nosso site não é direcionado a menores de 18 anos e não coletamos intencionalmente informações 
                de menores. Se tomarmos conhecimento de que coletamos dados de um menor sem consentimento 
                parental adequado, tomaremos medidas para remover essas informações.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">8. Google Analytics</h2>
              <p>
                Utilizamos o Google Analytics para análise de tráfego e comportamento dos visitantes. O 
                Google Analytics utiliza cookies para coletar informações sobre o uso do site. Essas 
                informações são usadas para compilar relatórios e nos ajudar a melhorar o site. Os cookies 
                coletam informações de forma anônima.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">9. Alterações nesta Política</h2>
              <p>
                Podemos atualizar esta Política de Privacidade periodicamente. Recomendamos que você revise 
                esta página regularmente para se manter informado sobre como protegemos suas informações. 
                A data da última atualização será sempre indicada no final desta política.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">10. Encarregado de Dados (DPO)</h2>
              <p>
                Para questões relacionadas à proteção de dados e exercício de seus direitos sob a LGPD, 
                entre em contato através dos canais disponibilizados no rodapé do site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">11. Contato</h2>
              <p>
                Se você tiver dúvidas sobre esta Política de Privacidade ou sobre o tratamento de seus 
                dados pessoais, entre em contato conosco através da página de contato ou pelos canais 
                disponibilizados no rodapé do site.
              </p>
            </section>

            <section className="border-t pt-6">
              <p className="text-sm">
                <strong>Última atualização:</strong> Novembro de 2025
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default PrivacyPolicy;
