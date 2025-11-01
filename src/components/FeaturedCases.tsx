import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
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
      .limit(3);

    if (error) {
      console.error('Error loading featured cases:', error);
      return;
    }

    setCases((data || []) as CaseStudy[]);
  };

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

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {cases.map((caseItem, index) => (
            <Card 
              key={caseItem.id} 
              className={`hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border-t-4 border-wine-900 ${
                isIntersecting 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge className="bg-wine-900">{caseItem.sector}</Badge>
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <CardTitle className="font-lato text-xl">{caseItem.title}</CardTitle>
                <CardDescription className="font-lato">{caseItem.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {caseItem.results.map((result, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-green-600" />
                      <span className="text-sm font-lato font-semibold text-gray-700">{result}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
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
