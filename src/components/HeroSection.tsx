import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Award, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import datacenterHero from '@/assets/datacenter-hero.jpg';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
const HeroSection = () => {
  const [heroImage, setHeroImage] = useState(datacenterHero);
  const [heroTitle, setHeroTitle] = useState('Soluções em Automação Predial e Infraestrutura de Alta Performance');
  const [heroSubtitle, setHeroSubtitle] = useState('Atendimento em todo o território nacional, com engenheiros certificados CREA e compliance com normas NRs, ISO 9001 e ABNT.');
  const [heroDescription, setHeroDescription] = useState('Mais de 15 anos de experiência em projetos de automação predial, infraestrutura de TI e telecomunicações para empresas de médio e grande porte.');

  useEffect(() => {
    loadHeroSettings();
  }, []);

  const loadHeroSettings = async () => {
    const { data } = await supabase
      .from('settings')
      .select('key, value')
      .in('key', ['hero_image_url', 'hero_title', 'hero_subtitle', 'hero_description']);
    
    if (data) {
      data.forEach(setting => {
        if (setting.key === 'hero_image_url' && setting.value && setting.value.trim() !== '') {
          setHeroImage(setting.value);
        } else if (setting.key === 'hero_title' && setting.value) {
          setHeroTitle(setting.value);
        } else if (setting.key === 'hero_subtitle' && setting.value) {
          setHeroSubtitle(setting.value);
        } else if (setting.key === 'hero_description' && setting.value) {
          setHeroDescription(setting.value);
        }
      });
    }
  };
  return <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Blue Overlay */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed" style={{
      backgroundImage: `linear-gradient(rgba(30, 58, 138, 0.8), rgba(30, 58, 138, 0.6)), url('${heroImage}')`
    }} />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-playfair text-5xl md:text-7xl font-bold mb-6 leading-tight animate-fade-in">
            {heroTitle}
          </h1>
          
          <p className="font-lato text-xl md:text-2xl mb-6 text-gray-100 max-w-3xl mx-auto animate-fade-in" style={{
          animationDelay: '0.2s'
        }}>
            {heroSubtitle}
          </p>

          <div className="mb-8 max-w-4xl mx-auto animate-fade-in" style={{
          animationDelay: '0.3s'
        }}>
            <p className="font-lato text-lg md:text-xl text-gray-200 mb-4">
              {heroDescription}
            </p>
            <p className="font-lato text-base md:text-lg text-gray-300">
              Especialistas em soluções completas: desde o projeto até a implementação e manutenção, 
              garantindo eficiência operacional, segurança e conformidade técnica.
            </p>
          </div>

          {/* Key Features */}
          <div className="flex flex-wrap justify-center gap-6 mb-10 text-sm md:text-base animate-fade-in" style={{
          animationDelay: '0.4s'
        }}>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-gold-500" />
              <span>NR-10 | NR-12 Certificado</span>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-gold-500" />
              <span>ISO 9001 | CREA/DF</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-gold-500" />
              <span>Atendimento Nacional</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{
          animationDelay: '0.6s'
        }}>
            <Link to="/contato" className="w-full sm:w-auto">
              <Button size="lg" className="bg-gold-500 hover:bg-gold-600 text-primary font-lato font-semibold px-8 py-4 text-lg group w-full sm:w-auto">
                Solicitar Orçamento
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/servicos" className="w-full sm:w-auto">
              <Button size="lg" variant="outline-light" className="font-lato font-semibold px-8 py-4 text-lg transition-all duration-300 w-full sm:w-auto">
                Ver Nossos Serviços
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce hidden md:block">
        
      </div>
    </section>;
};
export default HeroSection;