import { Building2, Store, Factory, Briefcase, Users, Globe, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import useEmblaCarousel from 'embla-carousel-react';
import { Button } from '@/components/ui/button';

interface ClientLogo {
  id: string;
  company_name: string;
  logo_url: string;
  display_order: number;
  icon_fallback?: string;
  website_url?: string;
}

const ClientLogos = () => {
  const [clients, setClients] = useState<ClientLogo[]>([]);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: 'start',
    slidesToScroll: 6
  });

  useEffect(() => {
    loadClientLogos();
  }, []);

  const loadClientLogos = async () => {
    const { data } = await supabase
      .from('client_logos')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (data) {
      setClients(data);
    }
  };

  const getIconComponent = (iconName?: string) => {
    switch (iconName) {
      case 'Store': return Store;
      case 'Factory': return Factory;
      case 'Briefcase': return Briefcase;
      case 'Users': return Users;
      case 'Globe': return Globe;
      default: return Building2;
    }
  };

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  return (
    <div className="py-12 bg-white/10 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <p className="text-center text-gray-300 font-lato text-sm mb-6">
          Empresas que confiam em nossos serviços
        </p>
        
        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-4">
              {clients.map((client, index) => {
              const IconComponent = getIconComponent(client.icon_fallback);
              const content = (
                <>
                  {client.logo_url && client.logo_url.trim() !== '' ? (
                    <img 
                      src={client.logo_url} 
                      alt={client.company_name}
                      className="h-20 w-20 object-contain mb-2"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent && !parent.querySelector('svg')) {
                          const IconFallback = getIconComponent(client.icon_fallback);
                          const iconWrapper = document.createElement('div');
                          iconWrapper.className = 'h-20 w-20 flex items-center justify-center mb-2';
                          parent.insertBefore(iconWrapper, target);
                          
                          import('react-dom/client').then(({ createRoot }) => {
                            const root = createRoot(iconWrapper);
                            root.render(<IconFallback className="h-16 w-16 text-gold-500" />);
                          });
                        }
                      }}
                    />
                  ) : (
                    <IconComponent className="h-20 w-20 text-gold-500 mb-2" />
                  )}
                  <span className="font-lato text-white text-sm font-semibold text-center whitespace-nowrap">
                    {client.company_name}
                  </span>
                </>
              );

              const websiteUrl = client.website_url && client.website_url.trim() !== '' 
                ? (client.website_url.startsWith('http://') || client.website_url.startsWith('https://') 
                    ? client.website_url 
                    : `https://${client.website_url}`)
                : null;

              return websiteUrl ? (
                <a
                  key={`${client.id}-${index}`}
                  href={websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-all duration-300 cursor-pointer flex-[0_0_calc(16.666%-14px)] min-w-0"
                >
                  {content}
                </a>
              ) : (
                <div 
                  key={`${client.id}-${index}`}
                  className="flex flex-col items-center justify-center p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-all duration-300 flex-[0_0_calc(16.666%-14px)] min-w-0"
                >
                  {content}
                </div>
              );
            })}
            </div>
          </div>

          {/* Navigation Buttons */}
          <Button
            variant="outline"
            size="icon"
            onClick={scrollPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white/90 hover:bg-white border-wine-900/20 text-wine-900"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={scrollNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white/90 hover:bg-white border-wine-900/20 text-wine-900"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ClientLogos;
