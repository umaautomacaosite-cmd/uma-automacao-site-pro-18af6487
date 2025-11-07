import { Building2, Store, Factory, Briefcase, Users, Globe } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

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

  return (
    <div className="py-12 bg-white/10 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <p className="text-center text-gray-300 font-lato text-sm mb-6">
          Empresas que confiam em nossos serviços
        </p>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 items-center">
          {clients.map((client) => {
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
                        
                        // Render the icon using React
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
                <span className="font-lato text-white text-sm font-semibold text-center">{client.company_name}</span>
              </>
            );

            const websiteUrl = client.website_url && client.website_url.trim() !== '' 
              ? (client.website_url.startsWith('http://') || client.website_url.startsWith('https://') 
                  ? client.website_url 
                  : `https://${client.website_url}`)
              : null;

            return websiteUrl ? (
              <a
                key={client.id}
                href={websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-all duration-300 cursor-pointer"
              >
                {content}
              </a>
            ) : (
              <div 
                key={client.id} 
                className="flex flex-col items-center justify-center p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-all duration-300"
              >
                {content}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ClientLogos;
