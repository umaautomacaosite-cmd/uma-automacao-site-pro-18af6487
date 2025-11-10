
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
  Award,
  Eye
} from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

type CaseStudyDb = Tables<'case_studies'>;

interface CaseStudy extends Omit<CaseStudyDb, 'technologies' | 'standards' | 'results'> {
  technologies: string[];
  standards: string[];
  results: string[];
}

interface CaseStudyImage {
  id: string;
  image_url: string;
  description: string | null;
  display_order: number;
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
  const [selectedCase, setSelectedCase] = useState<CaseStudy | null>(null);
  const [caseImages, setCaseImages] = useState<CaseStudyImage[]>([]);

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

  const loadCaseImages = async (caseId: string) => {
    const { data, error } = await supabase
      .from('case_study_images')
      .select('*')
      .eq('case_study_id', caseId)
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error loading case images:', error);
      return;
    }

    setCaseImages((data || []) as CaseStudyImage[]);
  };

  const handleViewDetails = async (caseStudy: CaseStudy) => {
    setSelectedCase(caseStudy);
    await loadCaseImages(caseStudy.id);
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
              return (
              <Card key={caseStudy.id} className="border-2 hover:shadow-xl transition-shadow overflow-hidden flex flex-col">
                <div 
                  className="h-48 bg-cover bg-center relative"
                  style={{ backgroundImage: `url(${caseStudy.cover_image_url || caseStudy.image_url || 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'})` }}
                >
                  <Badge className="absolute top-4 right-4 bg-wine-900 text-white">
                    Conformidade Total
                  </Badge>
                </div>
                
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="font-playfair text-xl text-wine-900">
                      {caseStudy.title}
                    </CardTitle>
                    <div className="text-sm text-gray-500 font-lato whitespace-nowrap ml-2">
                      {caseStudy.start_year && caseStudy.end_year 
                        ? `${caseStudy.start_year} - ${caseStudy.end_year}`
                        : caseStudy.year}
                    </div>
                  </div>
                  <CardDescription className="font-lato">
                    <div className="flex items-center space-x-1 text-sm">
                      <MapPin className="h-4 w-4" />
                      <span>{caseStudy.location}</span>
                    </div>
                  </CardDescription>
                </CardHeader>

                 <CardContent className="space-y-4 flex flex-col flex-grow">
                   <div className="flex-grow">
                     <div>
                       <h4 className="font-lato font-semibold text-wine-900 mb-2 text-sm">
                         Solução Aplicada
                       </h4>
                       <p className="font-lato text-sm text-gray-700 line-clamp-3">
                         {caseStudy.description}
                       </p>
                     </div>

                     <div className="mt-4">
                       <h4 className="font-lato font-semibold text-wine-900 mb-2 text-sm">
                         Tecnologias
                       </h4>
                       <div className="flex flex-wrap gap-2">
                         {caseStudy.technologies.slice(0, 3).map((tech, idx) => (
                           <Badge key={idx} variant="secondary" className="text-xs">
                             {tech}
                           </Badge>
                         ))}
                         {caseStudy.technologies.length > 3 && (
                           <Badge variant="secondary" className="text-xs">
                             +{caseStudy.technologies.length - 3} mais
                           </Badge>
                         )}
                       </div>
                     </div>

                     <div className="mt-4">
                       <h4 className="font-lato font-semibold text-wine-900 mb-2 text-sm">
                         Normas Aplicadas
                       </h4>
                       <div className="flex flex-wrap gap-2">
                         {caseStudy.standards.slice(0, 3).map((standard, idx) => (
                           <Badge key={idx} variant="outline" className="text-xs">
                             {standard}
                           </Badge>
                         ))}
                         {caseStudy.standards.length > 3 && (
                           <Badge variant="outline" className="text-xs">
                             +{caseStudy.standards.length - 3} mais
                           </Badge>
                         )}
                       </div>
                     </div>

                     <div className="mt-4">
                       <h4 className="font-lato font-semibold text-wine-900 mb-2 text-sm">
                         Resultados Obtidos
                       </h4>
                       <div className="space-y-1">
                         {caseStudy.results.slice(0, 2).map((result, idx) => (
                           <div key={idx} className="flex items-start space-x-2">
                             <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                             <span className="font-lato text-xs line-clamp-1">{result}</span>
                           </div>
                         ))}
                         {caseStudy.results.length > 2 && (
                           <p className="text-xs text-gray-500 font-lato">
                             +{caseStudy.results.length - 2} resultados adicionais
                           </p>
                         )}
                       </div>
                     </div>
                   </div>

                   <Button 
                      onClick={() => handleViewDetails(caseStudy)}
                      className="bg-wine-900 hover:bg-wine-800 text-white font-lato font-semibold w-full mt-4"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Ver Detalhes Completos
                    </Button>
                  </CardContent>
              </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Modal de Detalhes */}
      <Dialog open={!!selectedCase} onOpenChange={(open) => !open && setSelectedCase(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedCase && (
            <>
              <DialogHeader>
                <DialogTitle className="font-playfair text-2xl text-wine-900">
                  {selectedCase.client}
                </DialogTitle>
                <DialogDescription className="flex items-center gap-2 text-base">
                  <MapPin className="h-4 w-4" />
                  {selectedCase.location} • {selectedCase.start_year && selectedCase.end_year 
                    ? `${selectedCase.start_year} - ${selectedCase.end_year}`
                    : selectedCase.year}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Imagens do Case */}
                {caseImages.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-lato font-semibold text-wine-900 text-lg">
                      Imagens do Projeto
                    </h3>
                    <div className="grid grid-cols-1 gap-6">
                      {caseImages.map((image) => (
                        <div key={image.id} className="space-y-3">
                          <img 
                            src={image.image_url} 
                            alt={image.description || 'Imagem do projeto'}
                            className="w-full h-auto max-h-96 object-contain rounded-lg border"
                          />
                          {image.description && (
                            <p className="text-sm text-gray-600 text-center italic px-4">
                              {image.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Descrição */}
                <div>
                  <h3 className="font-lato font-semibold text-wine-900 text-lg mb-2">
                    Solução Aplicada
                  </h3>
                  <p className="font-lato text-gray-700 whitespace-pre-line">
                    {selectedCase.description}
                  </p>
                </div>

                {/* Tecnologias */}
                <div>
                  <h3 className="font-lato font-semibold text-wine-900 text-lg mb-2">
                    Tecnologias Utilizadas
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCase.technologies.map((tech, idx) => (
                      <Badge key={idx} variant="secondary">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Normas */}
                <div>
                  <h3 className="font-lato font-semibold text-wine-900 text-lg mb-2">
                    Normas Aplicadas
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCase.standards.map((standard, idx) => (
                      <Badge key={idx} variant="outline">
                        {standard}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Resultados */}
                <div>
                  <h3 className="font-lato font-semibold text-wine-900 text-lg mb-2">
                    Resultados Obtidos
                  </h3>
                  <div className="space-y-2">
                    {selectedCase.results.map((result, idx) => (
                      <div key={idx} className="flex items-start space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="font-lato">{result}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="pt-4 border-t">
                  <Link to="/contato">
                    <Button className="bg-wine-900 hover:bg-wine-800 text-white font-lato font-semibold w-full">
                      Solicitar Projeto Similar
                    </Button>
                  </Link>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

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
