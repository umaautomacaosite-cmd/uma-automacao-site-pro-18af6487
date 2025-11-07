import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import * as LucideIcons from 'lucide-react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

interface Certification {
  id: string;
  title: string;
  description: string;
  icon: string;
  icon_color: string;
}

const Certifications = () => {
  const { ref, isIntersecting } = useIntersectionObserver({ threshold: 0.2 });
  const [certifications, setCertifications] = useState<Certification[]>([]);

  useEffect(() => {
    loadCertifications();
  }, []);

  const loadCertifications = async () => {
    const { data } = await supabase
      .from('certifications')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });
    
    if (data) {
      setCertifications(data);
    }
  };

  return (
    <section className="py-16 bg-gradient-to-r from-wine-900 to-wine-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-playfair text-3xl font-bold text-white mb-2">
            Certificações e Compliance
          </h2>
          <p className="font-lato text-gray-200">
            Excelência técnica reconhecida e certificada
          </p>
        </div>

        <div ref={ref} className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {certifications.map((cert, index) => {
            const IconComponent = (LucideIcons as any)[cert.icon] || LucideIcons.Shield;
            return (
              <div 
                key={cert.id}
                className={`bg-white/10 backdrop-blur-sm p-6 rounded-lg text-center hover:bg-white/20 transition-all duration-500 hover:scale-105 ${
                  isIntersecting 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <IconComponent className={`h-12 w-12 mx-auto mb-4`} style={{ color: cert.icon_color }} />
                <h3 className="font-lato font-bold text-white text-lg mb-1">{cert.title}</h3>
                <p className="font-lato text-sm text-gray-300">{cert.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Certifications;
