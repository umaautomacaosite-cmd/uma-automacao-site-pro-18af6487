import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, Users, MapPin, Target, Eye, Heart, CheckCircle, Calendar } from 'lucide-react';
const About = () => {
  const values = [{
    icon: Target,
    title: "Excelência Técnica",
    description: "Comprometimento com a qualidade e inovação em cada projeto entregue."
  }, {
    icon: Users,
    title: "Equipe Especializada",
    description: "Engenheiros certificados CREA com vasta experiência em automação industrial."
  }, {
    icon: CheckCircle,
    title: "Conformidade Total",
    description: "Aderência rigorosa às normas NRs, ISO e padrões internacionais."
  }, {
    icon: Heart,
    title: "Relacionamento Duradouro",
    description: "Parceria de longo prazo com nossos clientes e suporte contínuo."
  }];
  const timeline = [{
    year: "2008",
    title: "Fundação da Empresa",
    description: "Início das atividades com foco em automação industrial."
  }, {
    year: "2012",
    title: "Certificação ISO 9001",
    description: "Primeira certificação de qualidade conquistada."
  }, {
    year: "2015",
    title: "Expansão Nacional",
    description: "Início do atendimento em todo território nacional."
  }, {
    year: "2018",
    title: "1500+ Projetos",
    description: "Marco de 1500 projetos entregues com sucesso."
  }, {
    year: "2020",
    title: "Tecnologia Digital",
    description: "Incorporação de tecnologias Industry 4.0."
  }, {
    year: "2024",
    title: "Líder de Mercado",
    description: "Reconhecimento como referência em automação industrial."
  }];
  return <div className="min-h-screen">
      <Header />
      
      {/* Page Header */}
      <section className="bg-gradient-to-r from-wine-900 to-wine-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-playfair text-5xl font-bold mb-4">
            Sobre a UMA AUTOMAÇÃO
          </h1>
          <p className="font-lato text-xl max-w-3xl mx-auto">
            Mais de 15 anos de experiência em soluções de automação industrial, com engenheiros certificados CREA e comprometimento total com a excelência técnica.
          </p>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-playfair text-4xl font-bold text-wine-900 mb-6">
                Nossa História
              </h2>
              <p className="font-lato text-lg text-gray-700 mb-6">
                Fundada em 2008, a UMA AUTOMAÇÃO nasceu com o propósito de fornecer soluções técnicas de excelência em automação industrial para empresas de todos os portes. Nossa trajetória é marcada pela constante busca por inovação e qualidade.
              </p>
              <p className="font-lato text-lg text-gray-700 mb-6">
                Com uma equipe de engenheiros certificados CREA e técnicos especializados, desenvolvemos projetos que atendem rigorosamente às normas regulamentadoras NR-10, NR-12 e padrões internacionais ISO.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-wine-50 rounded-lg">
                  <div className="font-playfair text-3xl font-bold text-wine-900">1500+</div>
                  <div className="font-lato text-sm text-gray-600">Projetos Entregues</div>
                </div>
                <div className="text-center p-4 bg-wine-50 rounded-lg">
                  <div className="font-playfair text-3xl font-bold text-wine-900">25+</div>
                  <div className="font-lato text-sm text-gray-600">Anos de Experiência</div>
                </div>
              </div>
            </div>
            <div>
              <img src="https://images.unsplash.com/photo-1487958449943-2429e8be8625?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Escritório UMA AUTOMAÇÃO" className="rounded-lg shadow-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card className="text-center p-6">
              <CardContent>
                <Target className="h-12 w-12 text-wine-900 mx-auto mb-4" />
                <h3 className="font-playfair text-2xl font-bold text-wine-900 mb-4">Missão</h3>
                <p className="font-lato text-gray-700">
                  Fornecer soluções em automação industrial com excelência técnica, garantindo segurança, eficiência e conformidade às normas regulamentadoras.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent>
                <Eye className="h-12 w-12 text-wine-900 mx-auto mb-4" />
                <h3 className="font-playfair text-2xl font-bold text-wine-900 mb-4">Visão</h3>
                <p className="font-lato text-gray-700">
                  Ser a empresa de referência em automação industrial no Brasil, reconhecida pela qualidade técnica e inovação.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent>
                <Heart className="h-12 w-12 text-wine-900 mx-auto mb-4" />
                <h3 className="font-playfair text-2xl font-bold text-wine-900 mb-4">Valores</h3>
                <p className="font-lato text-gray-700">
                  Ética, transparência, qualidade técnica, segurança no trabalho e comprometimento com resultados.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Values Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                <CardContent>
                  <value.icon className="h-10 w-10 text-wine-900 mx-auto mb-4" />
                  <h4 className="font-lato font-semibold text-lg mb-2">{value.title}</h4>
                  <p className="font-lato text-sm text-gray-600">{value.description}</p>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="font-playfair text-4xl font-bold text-center text-wine-900 mb-16">
            Nossa Trajetória
          </h2>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-wine-200"></div>
            
            <div className="space-y-12">
              {timeline.map((event, index) => <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <Card className="p-6 hover:shadow-lg transition-shadow">
                      <CardContent>
                        <Badge className="bg-wine-900 text-white mb-2">
                          <Calendar className="mr-1 h-3 w-3" />
                          {event.year}
                        </Badge>
                        <h4 className="font-playfair text-xl font-bold text-wine-900 mb-2">
                          {event.title}
                        </h4>
                        <p className="font-lato text-gray-700">{event.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="w-4 h-4 bg-wine-900 rounded-full border-4 border-white shadow-lg relative z-10"></div>
                  <div className="w-1/2"></div>
                </div>)}
            </div>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-20 bg-wine-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-playfair text-4xl font-bold mb-8">
            Certificações e Credenciais
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white text-gray-900 p-6 rounded-lg">
              <Award className="h-12 w-12 text-wine-900 mx-auto mb-4" />
              <h3 className="font-lato font-bold text-lg mb-2">ISO 9001:2015</h3>
              <p className="font-lato text-sm">Sistema de Gestão da Qualidade Certificado</p>
            </div>
            <div className="bg-white text-gray-900 p-6 rounded-lg">
              <Users className="h-12 w-12 text-wine-900 mx-auto mb-4" />
              <h3 className="font-lato font-bold text-lg mb-2">CREA/DF</h3>
              <p className="font-lato text-sm">Engenheiros Registrados e Certificados</p>
            </div>
            <div className="bg-white text-gray-900 p-6 rounded-lg">
              <CheckCircle className="h-12 w-12 text-wine-900 mx-auto mb-4" />
              <h3 className="font-lato font-bold text-lg mb-2">NR-10 | NR-12</h3>
              <p className="font-lato text-sm">Conformidade Total com Normas Regulamentadoras</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>;
};
export default About;
