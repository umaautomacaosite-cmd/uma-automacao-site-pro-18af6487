import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Target, Eye, Heart, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

const AboutSection = () => {
  const { ref, isIntersecting } = useIntersectionObserver({ threshold: 0.2 });
  const [contents, setContents] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchAboutContent();
  }, []);

  const fetchAboutContent = async () => {
    try {
      const { data } = await supabase
        .from('about_content')
        .select('*')
        .eq('is_active', true);
      
      if (data) {
        const contentMap: Record<string, string> = {};
        data.forEach((item: any) => {
          contentMap[item.section_key] = item.content;
        });
        setContents(contentMap);
      }
    } catch (error) {
      console.error('Erro ao carregar conteúdo sobre:', error);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white via-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-playfair text-4xl font-bold text-gray-900 mb-4">
            Sobre Nós
          </h2>
          <p className="font-lato text-xl text-gray-600 max-w-3xl mx-auto">
            {contents.history_p1 || 'Fundada em 2008, a UMA AUTOMAÇÃO nasceu com o propósito de fornecer soluções técnicas de excelência em automação industrial.'}
          </p>
        </div>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card 
            className={`text-center p-6 hover:shadow-xl hover:-translate-y-2 transition-all duration-500 ${
              isIntersecting 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-10'
            }`}
            style={{ transitionDelay: '0ms' }}
          >
            <CardContent className="pt-6">
              <Target className="h-12 w-12 text-wine-900 mx-auto mb-4" />
              <h3 className="font-playfair text-2xl font-bold text-wine-900 mb-4">Missão</h3>
              <p className="font-lato text-gray-700">
                {contents.mission || 'Fornecer soluções em automação industrial com excelência técnica, atendendo rigorosamente às normas regulamentadoras.'}
              </p>
            </CardContent>
          </Card>

          <Card 
            className={`text-center p-6 hover:shadow-xl hover:-translate-y-2 transition-all duration-500 ${
              isIntersecting 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-10'
            }`}
            style={{ transitionDelay: '100ms' }}
          >
            <CardContent className="pt-6">
              <Eye className="h-12 w-12 text-wine-900 mx-auto mb-4" />
              <h3 className="font-playfair text-2xl font-bold text-wine-900 mb-4">Visão</h3>
              <p className="font-lato text-gray-700">
                {contents.vision || 'Ser a empresa de referência em automação industrial no Brasil, reconhecida pela qualidade técnica e compromisso.'}
              </p>
            </CardContent>
          </Card>

          <Card 
            className={`text-center p-6 hover:shadow-xl hover:-translate-y-2 transition-all duration-500 ${
              isIntersecting 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-10'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            <CardContent className="pt-6">
              <Heart className="h-12 w-12 text-wine-900 mx-auto mb-4" />
              <h3 className="font-playfair text-2xl font-bold text-wine-900 mb-4">Valores</h3>
              <p className="font-lato text-gray-700">
                {contents.values_summary || 'Ética, transparência, qualidade técnica, segurança no trabalho e compromisso com nossos clientes.'}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Link to="/sobre">
            <Button className="bg-wine-900 hover:bg-wine-800 text-white font-lato font-semibold px-8 py-3 text-lg group">
              Conheça Nossa História
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
