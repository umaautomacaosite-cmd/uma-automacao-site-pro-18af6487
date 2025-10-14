import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import Testimonials from '@/components/Testimonials';
import ClientLogos from '@/components/ClientLogos';
import HowItWorks from '@/components/HowItWorks';
import FeaturedCases from '@/components/FeaturedCases';
import Certifications from '@/components/Certifications';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Network, Zap, Settings, Shield, Award, Users, MapPin, ArrowRight, CheckCircle } from 'lucide-react';
import { useCountUp } from '@/hooks/useCountUp';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

const StatsCard = ({ stat }: { stat: { number: string; label: string; icon: any; value: number } }) => {
  const { count, ref } = useCountUp(stat.value, 2000);
  const IconComponent = stat.icon;

  return (
    <div ref={ref} className="text-center group">
      <IconComponent className="h-12 w-12 text-gold-500 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
      <div className="font-playfair text-4xl font-bold mb-2">
        {count}{stat.number.includes('+') ? '+' : stat.number.includes('%') ? '%' : ''}
      </div>
      <div className="font-lato text-lg text-gray-200">{stat.label}</div>
    </div>
  );
};

const Index = () => {
  const { ref: servicesRef, isIntersecting: servicesVisible } = useIntersectionObserver({ threshold: 0.1 });

  const services = [{
    icon: Network,
    title: "Redes e Infraestrutura",
    description: "Fibra óptica FTTH/FTTX, cabeamento estruturado Cat 7/6a/6",
    features: ["Certificação OTDR", "Normas ANSI/TIA-568", "ISO/IEC 11801"]
  }, {
    icon: Zap,
    title: "Energia e Elétrica",
    description: "Busway trifásico, fechamento de quadros elétricos",
    features: ["NR-12 Compliance", "ABNT NBR 5410", "Projeto CREA"]
  }, {
    icon: Settings,
    title: "Automação Industrial",
    description: "Sistemas de controle e monitoramento industrial",
    features: ["PLCs", "IHMs", "SCADA"]
  }, {
    icon: Shield,
    title: "Segurança Industrial",
    description: "Sistemas de segurança conforme normas regulamentadoras",
    features: ["NR-10", "NR-12", "NR-33"]
  }];

  const stats = [{
    number: "1500+",
    label: "Projetos Entregues",
    icon: Award,
    value: 1500
  }, {
    number: "25+",
    label: "Anos de Experiência",
    icon: Users,
    value: 25
  }, {
    number: "100%",
    label: "Atendimento Nacional",
    icon: MapPin,
    value: 100
  }, {
    number: "24/7",
    label: "Suporte Técnico",
    icon: Shield,
    value: 24
  }];

  return <div className="min-h-screen">
      <Header />
      <HeroSection />
      <WhatsAppButton />
      
      {/* Services Overview */}
      <section className="py-20 bg-gradient-to-b from-gray-50 via-gray-100 to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl font-bold text-gray-900 mb-4">
              Nossos Serviços
            </h2>
            <p className="font-lato text-xl text-gray-600 max-w-3xl mx-auto">
              Soluções completas em automação industrial com engenheiros certificados CREA e compliance total com normas regulamentadoras.
            </p>
          </div>

          <div ref={servicesRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <Card 
                  key={index} 
                  className={`hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 group ${
                    servicesVisible 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <CardHeader>
                    <IconComponent className="h-12 w-12 text-wine-900 mb-4 group-hover:text-wine-700 group-hover:scale-110 transition-all duration-300" />
                    <CardTitle className="font-lato text-lg">{service.title}</CardTitle>
                    <CardDescription className="font-lato">{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {service.features.map((feature, idx) => <div key={idx} className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-lato">{feature}</span>
                        </div>)}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Link to="/servicos">
              <Button className="bg-wine-900 hover:bg-wine-800 text-white font-lato font-semibold px-8 py-3 text-lg group">
                Ver Todos os Serviços
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <HowItWorks />

      {/* Featured Cases */}
      <FeaturedCases />

      {/* Certifications */}
      <Certifications />

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-wine-900 via-wine-800 to-wine-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <StatsCard key={index} stat={stat} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-wine-900 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold-500 rounded-full blur-3xl"></div>
        </div>
        
        <ClientLogos />
        
        <div className="container mx-auto px-4 text-center relative z-10 mt-12">
          <h2 className="font-playfair text-4xl font-bold mb-4">
            Pronto para Transformar sua Infraestrutura?
          </h2>
          <p className="font-lato text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Entre em contato conosco e receba uma proposta personalizada para seu projeto de automação industrial.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contato">
              <Button size="lg" className="bg-wine-900 hover:bg-wine-800 text-white font-lato font-semibold px-8 py-4 text-lg">
                Solicitar Orçamento Gratuito
              </Button>
            </Link>
            <a 
              href="https://wa.me/5561999999999?text=Olá!%20Gostaria%20de%20falar%20com%20um%20especialista%20em%20automação%20industrial."
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white hover:bg-white hover:text-gray-900 text-white font-lato font-semibold px-8 py-4 text-lg"
              >
                Falar com Especialista
              </Button>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>;
};
export default Index;
