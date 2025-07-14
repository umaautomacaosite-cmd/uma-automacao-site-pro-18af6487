
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { 
  Network, 
  Zap, 
  Settings, 
  Shield, 
  Award, 
  Users, 
  MapPin,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

const Index = () => {
  const services = [
    {
      icon: Network,
      title: "Redes e Infraestrutura",
      description: "Fibra óptica FTTH/FTTX, cabeamento estruturado Cat 7/6a/6",
      features: ["Certificação OTDR", "Normas ANSI/TIA-568", "ISO/IEC 11801"]
    },
    {
      icon: Zap,
      title: "Energia e Elétrica",
      description: "Busway trifásico, fechamento de quadros elétricos",
      features: ["NR-12 Compliance", "ABNT NBR 5410", "Projeto CREA"]
    },
    {
      icon: Settings,
      title: "Automação Industrial",
      description: "Sistemas de controle e monitoramento industrial",
      features: ["PLCs", "IHMs", "SCADA"]
    },
    {
      icon: Shield,
      title: "Segurança Industrial",
      description: "Sistemas de segurança conforme normas regulamentadoras",
      features: ["NR-10", "NR-12", "NR-33"]
    }
  ];

  const stats = [
    { number: "500+", label: "Projetos Entregues", icon: Award },
    { number: "15+", label: "Anos de Experiência", icon: Users },
    { number: "100%", label: "Atendimento Nacional", icon: MapPin },
    { number: "24/7", label: "Suporte Técnico", icon: Shield }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      
      {/* Services Overview */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl font-bold text-gray-900 mb-4">
              Nossos Serviços
            </h2>
            <p className="font-lato text-xl text-gray-600 max-w-3xl mx-auto">
              Soluções completas em automação industrial com engenheiros certificados CREA e compliance total com normas regulamentadoras.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow group">
                <CardHeader>
                  <service.icon className="h-12 w-12 text-wine-900 mb-4 group-hover:text-wine-700 transition-colors" />
                  <CardTitle className="font-lato text-lg">{service.title}</CardTitle>
                  <CardDescription className="font-lato">{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-lato">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
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

      {/* Stats Section */}
      <section className="py-20 bg-wine-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="h-12 w-12 text-gold-500 mx-auto mb-4" />
                <div className="font-playfair text-4xl font-bold mb-2">{stat.number}</div>
                <div className="font-lato text-lg text-gray-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-playfair text-4xl font-bold mb-4">
            Pronto para Transformar sua Infraestrutura?
          </h2>
          <p className="font-lato text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Entre em contato conosco e receba uma proposta personalizada para seu projeto de automação industrial.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-wine-900 hover:bg-wine-800 text-white font-lato font-semibold px-8 py-4 text-lg">
              Solicitar Orçamento Gratuito
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900 font-lato font-semibold px-8 py-4 text-lg">
              Falar com Especialista
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
