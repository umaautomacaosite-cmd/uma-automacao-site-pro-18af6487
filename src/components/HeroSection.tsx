import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Award, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import datacenterHero from '@/assets/datacenter-hero.jpg';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const CACHE_KEY = 'hero_settings_cache';
const CACHE_DURATION = 1000 * 60 * 30; // 30 minutos

const HeroSection = () => {
  // Inicializar com valores do cache se existirem
  const getCachedSettings = () => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION) {
          return data;
        }
      }
    } catch (error) {
      console.error('Erro ao ler cache:', error);
    }
    return null;
  };

  const cachedSettings = getCachedSettings();
  
  const [isLoading, setIsLoading] = useState(!cachedSettings);
  const [heroImage, setHeroImage] = useState(cachedSettings?.heroImage || datacenterHero);
  const [heroTitle, setHeroTitle] = useState(cachedSettings?.heroTitle || 'Soluções em Automação Predial e Infraestrutura de Alta Performance');
  const [heroSubtitle, setHeroSubtitle] = useState(cachedSettings?.heroSubtitle || 'Atendimento em todo o território nacional, com engenheiros certificados CREA e compliance com normas NRs, ISO 9001 e ABNT.');
  const [heroDescription, setHeroDescription] = useState(cachedSettings?.heroDescription || 'Mais de 15 anos de experiência em projetos de automação predial, infraestrutura de TI e telecomunicações para empresas de médio e grande porte.');

  useEffect(() => {
    loadHeroSettings();
  }, []);

  const loadHeroSettings = async () => {
    try {
      console.log('Carregando configurações do hero...');
      const { data, error } = await supabase
        .from('settings')
        .select('key, value')
        .in('key', ['hero_image_url', 'hero_title', 'hero_subtitle', 'hero_description']);

      if (error) {
        console.error('Erro ao buscar configurações do hero:', error);
        setIsLoading(false);
        return;
      }

      console.log('Dados recebidos do Supabase:', data);

      if (data && data.length > 0) {
        const settings = {
          heroImage: datacenterHero,
          heroTitle: 'Soluções em Automação Predial e Infraestrutura de Alta Performance',
          heroSubtitle: 'Atendimento em todo o território nacional, com engenheiros certificados CREA e compliance com normas NRs, ISO 9001 e ABNT.',
          heroDescription: 'Mais de 15 anos de experiência em projetos de automação predial, infraestrutura de TI e telecomunicações para empresas de médio e grande porte.'
        };

        data.forEach(setting => {
          if (setting.key === 'hero_image_url' && setting.value && setting.value.trim() !== '') {
            settings.heroImage = setting.value;
          } else if (setting.key === 'hero_title' && setting.value) {
            settings.heroTitle = setting.value;
          } else if (setting.key === 'hero_subtitle' && setting.value) {
            settings.heroSubtitle = setting.value;
          } else if (setting.key === 'hero_description' && setting.value) {
            settings.heroDescription = setting.value;
          }
        });

        console.log('Settings processados:', settings);

        // Atualizar estados
        setHeroImage(settings.heroImage);
        setHeroTitle(settings.heroTitle);
        setHeroSubtitle(settings.heroSubtitle);
        setHeroDescription(settings.heroDescription);

        // Salvar no cache
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify({
            data: settings,
            timestamp: Date.now()
          }));
        } catch (error) {
          console.error('Erro ao salvar cache:', error);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar configurações do hero:', error);
    } finally {
      setIsLoading(false);
    }
  };
  if (isLoading) {
    return (
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-wine-900 via-wine-800 to-wine-900">
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
            <div className="h-16 bg-white/10 rounded-lg mx-auto w-3/4" />
            <div className="h-8 bg-white/10 rounded-lg mx-auto w-2/3" />
            <div className="h-6 bg-white/10 rounded-lg mx-auto w-1/2" />
            <div className="flex justify-center gap-4 mt-8">
              <div className="h-12 bg-white/10 rounded-lg w-48" />
              <div className="h-12 bg-white/10 rounded-lg w-48" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden" key={heroImage}>
      {/* Background Image with Subtle Overlay */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed" style={{
        backgroundImage: `linear-gradient(rgba(30, 58, 138, 0.4), rgba(30, 58, 138, 0.3)), url('${heroImage}')`
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
              <span>ISO 9001 | CREA</span>
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
    </section>
  );
};

export default HeroSection;