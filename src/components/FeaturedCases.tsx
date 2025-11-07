import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, ChevronLeft, ChevronRight, Building2, Calendar, MapPin } from 'lucide-react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import * as LucideIcons from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

type CaseStudyDb = Tables<'case_studies'>;

interface CaseStudy extends Omit<CaseStudyDb, 'technologies' | 'standards' | 'results'> {
  technologies: string[];
  standards: string[];
  results: string[];
}

const FeaturedCases = () => {
  const { ref, isIntersecting } = useIntersectionObserver({ threshold: 0.2 });
  const [cases, setCases] = useState<CaseStudy[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const VISIBLE_CASES = 3;

  useEffect(() => {
    loadFeaturedCases();
  }, []);

  const loadFeaturedCases = async () => {
    const { data, error } = await supabase
      .from('case_studies')
      .select('*')
      .eq('is_active', true)
      .eq('is_featured', true)
      .order('display_order', { ascending: true })
      .limit(6);

    if (error) {
      console.error('Error loading featured cases:', error);
      return;
    }

    setCases((data || []) as CaseStudy[]);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => 
      prev + VISIBLE_CASES >= cases.length ? 0 : prev + VISIBLE_CASES
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? Math.max(0, cases.length - VISIBLE_CASES) : Math.max(0, prev - VISIBLE_CASES)
    );
  };

  const visibleCases = cases.slice(currentIndex, currentIndex + VISIBLE_CASES);

  if (cases.length === 0) return null;

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-playfair text-4xl font-bold text-gray-900 mb-4">
            Cases de Sucesso em Destaque
          </h2>
          <p className="font-lato text-xl text-gray-600 max-w-3xl mx-auto">
            Projetos que transformaram a operação de grandes empresas
          </p>
        </div>

        <div className="relative">
          {cases.length > VISIBLE_CASES && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white shadow-lg hidden lg:flex"
                onClick={prevSlide}
                disabled={currentIndex === 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white shadow-lg hidden lg:flex"
                onClick={nextSlide}
                disabled={currentIndex + VISIBLE_CASES >= cases.length}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}

          <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {visibleCases.map((caseItem, index) => {
              const IconComponent = (LucideIcons as any)[caseItem.icon] || Building2;

              return (
                <Card 
                  key={caseItem.id} 
                  className={`hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border-t-4 border-wine-900 overflow-hidden ${
                    isIntersecting 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  {caseItem.cover_image_url && (
                    <div className="w-full h-48 overflow-hidden">
                      <img 
                        src={caseItem.cover_image_url} 
                        alt={caseItem.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <Badge className="bg-wine-900">{caseItem.sector}</Badge>
                      <IconComponent className="h-5 w-5 text-wine-900" />
                    </div>
                    <CardTitle className="font-lato text-xl">{caseItem.title}</CardTitle>
                    <CardDescription className="font-lato line-clamp-2">{caseItem.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center text-gray-500">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{caseItem.year}</span>
                      </div>
                      <div className="flex items-center text-gray-500">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{caseItem.location}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {caseItem.results.slice(0, 2).map((result, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <div className="w-2 h-2 rounded-full bg-green-600 flex-shrink-0" />
                          <span className="text-sm font-lato font-semibold text-gray-700">{result}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {cases.length > VISIBLE_CASES && (
            <div className="flex justify-center mb-8 gap-2 lg:hidden">
              {Array.from({ length: Math.ceil(cases.length / VISIBLE_CASES) }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx * VISIBLE_CASES)}
                  className={`h-2 rounded-full transition-all ${
                    Math.floor(currentIndex / VISIBLE_CASES) === idx
                      ? 'w-8 bg-wine-900'
                      : 'w-2 bg-gray-300'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="text-center">
          <Link to="/cases">
            <Button className="bg-wine-900 hover:bg-wine-800 text-white font-lato font-semibold px-8 py-3 text-lg group">
              Ver Todos os Cases
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCases;
