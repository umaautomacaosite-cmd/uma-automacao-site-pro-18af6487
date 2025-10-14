import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Award, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import datacenterHero from '@/assets/datacenter-hero.jpg';
import { useEffect, useState } from 'react';

const HeroSection = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Blue Overlay and Parallax */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-100" 
        style={{
          backgroundImage: `linear-gradient(rgba(30, 58, 138, 0.8), rgba(30, 58, 138, 0.6)), url('${datacenterHero}')`,
          transform: `translateY(${scrollY * 0.5}px)`
        }} 
      />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-playfair text-5xl md:text-7xl font-bold mb-6 leading-tight animate-fade-in">
            Soluções em Automação Industrial e Infraestrutura de 
            <span className="text-gold-500"> Alta Performance</span>
          </h1>
          
          <p className="font-lato text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Atendimento em todo o território nacional, com engenheiros certificados CREA e compliance com normas NRs, ISO 9001 e ABNT.
          </p>

          {/* Key Features */}
          <div className="flex flex-wrap justify-center gap-6 mb-10 text-sm md:text-base animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-gold-500" />
              <span>NR-10 | NR-12 Certificado</span>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-gold-500" />
              <span>ISO 9001 | CREA/SP</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-gold-500" />
              <span>Atendimento Nacional</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <Link to="/contato">
              <Button size="lg" className="bg-wine-900 hover:bg-wine-800 text-white font-lato font-semibold px-8 py-4 text-lg group">
                Solicitar Orçamento
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/servicos">
              <Button size="lg" variant="outline" className="border-2 border-white hover:bg-white hover:text-wine-900 text-white font-lato font-semibold px-8 py-4 text-lg transition-all duration-300 w-full sm:w-auto">
                Ver Nossos Serviços
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce hidden md:block">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
        </div>
      </div>
    </section>;
};
export default HeroSection;