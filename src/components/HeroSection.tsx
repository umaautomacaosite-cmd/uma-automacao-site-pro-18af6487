
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Award, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Wine Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(128, 0, 32, 0.8), rgba(128, 0, 32, 0.6)), url('https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-playfair text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Soluções em Automação Industrial e Infraestrutura de 
            <span className="text-gold-500"> Alta Performance</span>
          </h1>
          
          <p className="font-lato text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto">
            Atendimento em todo o território nacional, com engenheiros certificados CREA e compliance com normas NRs, ISO 9001 e ABNT.
          </p>

          {/* Key Features */}
          <div className="flex flex-wrap justify-center gap-6 mb-10 text-sm md:text-base">
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
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-wine-900 hover:bg-wine-800 text-white font-lato font-semibold px-8 py-4 text-lg group"
            >
              Solicitar Orçamento
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Link to="/servicos">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-white text-white hover:bg-white hover:text-wine-900 font-lato font-semibold px-8 py-4 text-lg transition-all duration-300 w-full sm:w-auto"
              >
                Ver Nossos Serviços
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
