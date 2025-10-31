
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Building, 
  Factory, 
  Hospital, 
  GraduationCap,
  Store,
  Warehouse,
  Zap,
  Cpu,
  MapPin,
  CheckCircle,
  Award
} from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

type CaseStudyDb = Tables<'case_studies'>;

interface CaseStudy extends Omit<CaseStudyDb, 'technologies' | 'standards' | 'results'> {
  technologies: string[];
  standards: string[];
  results: string[];
}

const iconMap: Record<string, any> = {
  Building,
  Factory,
  Hospital,
  GraduationCap,
  Store,
  Warehouse,
  Zap,
  Cpu
};

const CaseStudies = () => {
  const [cases, setCases] = useState<CaseStudy[]>([]);

  useEffect(() => {
    loadCases();
  }, []);

  const loadCases = async () => {
    const { data, error } = await supabase
      .from('case_studies')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error loading cases:', error);
      return;
    }

    setCases((data || []) as CaseStudy[]);
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Page Header */}
      <section className="bg-gradient-to-r from-wine-900 to-wine-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-playfair text-5xl font-bold mb-4">
            Cases de Sucesso
          </h1>
          <p className="font-lato text-xl max-w-3xl mx-auto">
            Projetos entregues com excelência técnica, conformidade total com normas regulamentadoras e resultados comprovados em diversos setores.
          </p>
          <div className="mt-8">
            <Badge className="bg-gold-500 text-black font-semibold px-4 py-2 text-lg">
              <Award className="mr-2 h-5 w-5" />
              500+ Projetos Entregues
            </Badge>
          </div>
        </div>
      </section>

      {/* Cases Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {cases.map((caseStudy, index) => {
              const IconComponent = iconMap[caseStudy.icon] || Building;
              return (
              <Card key={caseStudy.id} className="border-2 hover:shadow-xl transition-shadow overflow-hidden">
                <div 
                  className="h-48 bg-cover bg-center relative"
                  style={{ backgroundImage: `url(${caseStudy.image_url || 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'})` }}
                >
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <IconComponent className="h-16 w-16 text-white" />
                  </div>
                  <Badge className="absolute top-4 right-4 bg-wine-900 text-white">
                    Conformidade Total
                  </Badge>
                </div>
                
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className="font-lato text-sm">
                      {caseStudy.sector}
                    </Badge>
                    <div className="text-sm text-gray-500 font-lato">
                      {caseStudy.year}
                    </div>
                  </div>
                  <CardTitle className="font-playfair text-xl text-wine-900">
                    {caseStudy.client}
                  </CardTitle>
                  <CardDescription className="font-lato">
                    <div className="flex items-center space-x-1 text-sm">
                      <MapPin className="h-4 w-4" />
                      <span>{caseStudy.location}</span>
                    </div>
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-lato font-semibold text-wine-900 mb-2">
                      Solução Aplicada
                    </h4>
                    <p className="font-lato text-sm text-gray-700">
                      {caseStudy.description}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-lato font-semibold text-wine-900 mb-2">
                      Tecnologias Utilizadas
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {caseStudy.technologies.map((tech, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-lato font-semibold text-wine-900 mb-2">
                      Normas Aplicadas
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {caseStudy.standards.map((standard, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {standard}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-lato font-semibold text-wine-900 mb-2">
                      Resultados Obtidos
                    </h4>
                    <div className="space-y-1">
                      {caseStudy.results.map((result, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="font-lato text-sm">{result}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                   <Link to="/contato">
                     <Button className="bg-wine-900 hover:bg-wine-800 text-white font-lato font-semibold w-full">
                       Solicitar Projeto Similar
                     </Button>
                   </Link>
                </CardContent>
              </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-playfair text-4xl font-bold mb-4">
            Seu Projeto Pode Ser o Próximo Case de Sucesso
          </h2>
          <p className="font-lato text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Entre em contato conosco e transforme sua infraestrutura com soluções técnicas de excelência.
          </p>
           <Link to="/contato">
             <Button size="lg" className="bg-wine-900 hover:bg-wine-800 text-white font-lato font-semibold px-8 py-4 text-lg">
               Solicitar Consultoria Gratuita
             </Button>
           </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CaseStudies;
