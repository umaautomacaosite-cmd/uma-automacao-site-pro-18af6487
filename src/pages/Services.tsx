import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Network, Zap, Settings, Shield, Database, Wrench, Wifi, HardDrive, MonitorSpeaker, CheckCircle, Users, Award } from 'lucide-react';
interface Service {
  id: string;
  title: string;
  category: string;
  description: string;
  applications: string[];
  standards: string[];
  features: string[];
  applications_icon_color: 'green' | 'red';
  features_icon_color: 'green' | 'red';
}
const Services = () => {
  const [activeCategory, setActiveCategory] = useState('redes');
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
    // Scroll to the services content area after a short delay to ensure DOM is updated
    setTimeout(() => {
      const servicesContent = document.getElementById('services-content');
      if (servicesContent) {
        servicesContent.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 100);
  };
  const categories = [{
    id: 'redes',
    name: 'Redes e Infraestrutura',
    icon: Network
  }, {
    id: 'energia',
    name: 'Energia e Elétrica',
    icon: Zap
  }, {
    id: 'automacao',
    name: 'Automação Predial',
    icon: Settings
  }, {
    id: 'seguranca',
    name: 'Segurança Predial',
    icon: Shield
  }, {
    id: 'datacenter',
    name: 'Data Center',
    icon: Database
  }, {
    id: 'manutencao',
    name: 'Manutenção e Operação',
    icon: Wrench
  }];
  useEffect(() => {
    fetchServices();
  }, []);
  const fetchServices = async () => {
    try {
      const {
        data,
        error
      } = await supabase.from('services').select('*').eq('is_active', true).order('title', {
        ascending: true
      });
      if (error) throw error;

      // Convert JSONB fields to arrays
      const formattedServices = (data || []).map(service => ({
        id: service.id,
        title: service.title,
        category: service.category,
        description: service.description,
        applications: service.applications as unknown as string[] || [],
        standards: service.standards as unknown as string[] || [],
        features: service.features as unknown as string[] || [],
        applications_icon_color: (service.applications_icon_color || 'green') as 'green' | 'red',
        features_icon_color: (service.features_icon_color || 'red') as 'green' | 'red'
      }));
      setServices(formattedServices);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };
  const servicesByCategory = services.reduce((acc, service) => {
    if (!acc[service.category]) {
      acc[service.category] = [];
    }
    acc[service.category].push(service);
    return acc;
  }, {} as Record<string, Service[]>);
  return <div className="min-h-screen">
      <Header />
      
      {/* Page Header */}
      <section className="bg-gradient-to-r from-wine-900 to-wine-700 text-white py-12 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-playfair text-3xl md:text-5xl font-bold mb-4">
            Nossos Serviços
          </h1>
          <p className="font-lato text-lg md:text-xl max-w-3xl mx-auto">Soluções técnicas especializadas em automação predial com compliance total às normas regulamentadoras e certificações internacionais.</p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4 sm:space-x-4">
            <Badge variant="secondary" className="bg-gold-500 text-black font-semibold">
              <Award className="mr-2 h-4 w-4" />
              ISO 9001 Certificado
            </Badge>
            <Badge variant="secondary" className="bg-green-600 text-white font-semibold">
              <Users className="mr-2 h-4 w-4" />
              Atendimento Nacional
            </Badge>
          </div>
        </div>
      </section>

      {/* Services Content */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:w-1/4">
              <div className="lg:sticky lg:top-8">
                <h3 className="font-playfair text-xl md:text-2xl font-bold mb-6">Categorias</h3>
                <nav className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
                  {categories.map(category => <button key={category.id} onClick={() => handleCategoryChange(category.id)} className={`w-full text-left p-3 md:p-4 rounded-lg font-lato font-medium transition-colors flex items-center space-x-3 ${activeCategory === category.id ? 'bg-wine-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                      <category.icon className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
                      <span className="text-sm md:text-base">{category.name}</span>
                    </button>)}
                </nav>
              </div>
            </div>

            {/* Services Content */}
            <div className="lg:w-3/4">
              {loading ? <div className="flex items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-wine-900"></div>
                </div> : servicesByCategory[activeCategory]?.length > 0 ? <div id="services-content" className="space-y-8">
                  {servicesByCategory[activeCategory].map(service => <Card key={service.id} className="border-2 hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <CardTitle className="font-playfair text-2xl text-wine-900">
                          {service.title}
                        </CardTitle>
                        <CardDescription className="font-lato text-lg">
                          {service.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Applications */}
                        <div>
                          <h4 className="font-lato font-semibold text-base md:text-lg mb-3">Aplicações</h4>
                          <div className="grid grid-cols-1 gap-2">
                            {service.applications.map((app, idx) => <div key={idx} className="flex items-start space-x-2">
                                <CheckCircle className={`h-4 w-4 mt-0.5 flex-shrink-0 ${service.applications_icon_color === 'green' ? 'text-green-600' : 'text-red-600'}`} />
                                <span className="font-lato text-sm">{app}</span>
                              </div>)}
                          </div>
                        </div>

                        {/* Standards */}
                        <div>
                          <h4 className="font-lato font-semibold text-lg mb-3">Normas e Padrões</h4>
                          <div className="flex flex-wrap gap-2">
                            {service.standards.map((standard, idx) => <Badge key={idx} variant="outline" className="font-lato">
                                {standard}
                              </Badge>)}
                          </div>
                        </div>

                        {/* Features */}
                        <div>
                          <h4 className="font-lato font-semibold text-base md:text-lg mb-3">Características Técnicas</h4>
                          <div className="grid grid-cols-1 gap-2">
                            {service.features.map((feature, idx) => <div key={idx} className="flex items-start space-x-2">
                                <CheckCircle className={`h-4 w-4 mt-0.5 flex-shrink-0 ${service.features_icon_color === 'green' ? 'text-green-600' : 'text-red-600'}`} />
                                <span className="font-lato text-sm">{feature}</span>
                              </div>)}
                          </div>
                        </div>

                        <Link to="/contato">
                          <Button className="bg-wine-900 hover:bg-wine-800 text-white font-lato font-semibold w-full text-sm md:text-base">
                            Solicitar Orçamento para este Serviço
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>)}
                </div> : <div className="text-center py-20">
                  <p className="font-lato text-gray-600">Nenhum serviço disponível nesta categoria.</p>
                </div>}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>;
};
export default Services;