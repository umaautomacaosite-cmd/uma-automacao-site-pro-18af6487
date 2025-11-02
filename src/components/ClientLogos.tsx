import { Building2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ClientLogo {
  id: string;
  company_name: string;
  logo_url: string;
  display_order: number;
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

  return (
    <div className="py-12 bg-white/10 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <p className="text-center text-gray-300 font-lato text-sm mb-6">
          Empresas que confiam em nossos serviços
        </p>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 items-center">
          {clients.map((client) => (
            <div 
              key={client.id} 
              className="flex flex-col items-center justify-center p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-all duration-300"
            >
              <img 
                src={client.logo_url} 
                alt={client.company_name}
                className="h-12 w-12 object-contain mb-2"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    const fallback = document.createElement('div');
                    fallback.innerHTML = '<svg class="h-8 w-8 text-gold-500 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>';
                    parent.insertBefore(fallback, target);
                  }
                }}
              />
              <span className="font-lato text-white text-sm font-semibold text-center">{client.company_name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClientLogos;
