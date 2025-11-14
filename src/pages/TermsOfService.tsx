import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';

const TermsOfService = () => {
  return (
    <>
      <SEO 
        title="Termos de Uso - UMA AUTOMAÇÃO"
        description="Termos de uso e condições gerais de utilização do site UMA AUTOMAÇÃO."
        canonical="/termos-de-uso"
      />
      <Header />
      <main className="min-h-screen bg-background py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-playfair font-bold mb-8">Termos de Uso</h1>
          
          <div className="space-y-6 text-muted-foreground">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">1. Aceitação dos Termos</h2>
              <p>
                Ao acessar e utilizar o site da UMA AUTOMAÇÃO, você concorda em cumprir e estar vinculado aos 
                seguintes termos de uso. Se você não concordar com qualquer parte destes termos, não deverá 
                utilizar nosso site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">2. Uso do Site</h2>
              <p className="mb-2">
                O conteúdo deste site é fornecido apenas para fins informativos. Você concorda em usar o site 
                apenas para fins legais e de maneira que não infrinja os direitos de terceiros ou restrinja ou 
                iniba o uso e aproveitamento do site por qualquer outra pessoa.
              </p>
              <p>
                É proibido:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Utilizar o site de forma que cause danos ou prejudique sua disponibilidade ou acessibilidade;</li>
                <li>Utilizar o site para transmitir material malicioso ou tecnologicamente prejudicial;</li>
                <li>Tentar obter acesso não autorizado ao site, servidor ou banco de dados;</li>
                <li>Realizar ataques de negação de serviço ou ataques distribuídos de negação de serviço.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">3. Propriedade Intelectual</h2>
              <p>
                Todo o conteúdo incluído neste site, como textos, gráficos, logotipos, imagens, clipes de áudio, 
                downloads digitais e compilações de dados, é propriedade da UMA AUTOMAÇÃO ou de seus fornecedores 
                de conteúdo e está protegido por leis de direitos autorais brasileiras e internacionais.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">4. Serviços Oferecidos</h2>
              <p>
                As informações sobre nossos serviços de automação industrial e predial são apresentadas de forma 
                geral. Propostas comerciais específicas serão fornecidas mediante solicitação formal e análise 
                técnica de cada projeto.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">5. Limitação de Responsabilidade</h2>
              <p>
                A UMA AUTOMAÇÃO não será responsável por quaisquer danos diretos, indiretos, incidentais, 
                consequenciais ou punitivos decorrentes do uso ou da incapacidade de usar este site ou qualquer 
                conteúdo nele contido.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">6. Links para Sites de Terceiros</h2>
              <p>
                Este site pode conter links para sites de terceiros. Estes links são fornecidos apenas para sua 
                conveniência. A UMA AUTOMAÇÃO não tem controle sobre o conteúdo desses sites e não assume 
                responsabilidade por eles.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">7. Modificações dos Termos</h2>
              <p>
                A UMA AUTOMAÇÃO se reserva o direito de modificar estes termos de uso a qualquer momento. 
                Recomendamos que você revise esta página periodicamente. O uso continuado do site após alterações 
                constitui sua aceitação dos novos termos.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">8. Lei Aplicável</h2>
              <p>
                Estes termos de uso são regidos pelas leis da República Federativa do Brasil. Qualquer disputa 
                relacionada a estes termos estará sujeita à jurisdição exclusiva dos tribunais de Brasília, DF.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">9. Contato</h2>
              <p>
                Se você tiver dúvidas sobre estes Termos de Uso, entre em contato conosco através da página de 
                contato ou pelos canais disponibilizados no rodapé do site.
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

export default TermsOfService;
