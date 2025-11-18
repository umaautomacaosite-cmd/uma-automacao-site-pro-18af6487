import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface RecentActivity {
  id: string;
  type: 'service' | 'case_study' | 'testimonial' | 'certification';
  title: string;
  action: string;
  timestamp: string;
}

export const useRecentActivities = () => {
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const allActivities: RecentActivity[] = [];

        // Buscar serviços recentes
        const { data: services, error: servicesError } = await supabase
          .from('services')
          .select('id, title, created_at, updated_at')
          .order('updated_at', { ascending: false })
          .limit(5);

        if (servicesError) throw servicesError;

        if (services) {
          services.forEach(service => {
            allActivities.push({
              id: service.id,
              type: 'service',
              title: service.title,
              action: 'atualizado',
              timestamp: service.updated_at,
            });
          });
        }

        // Buscar cases recentes
        const { data: cases, error: casesError } = await supabase
          .from('case_studies')
          .select('id, title, created_at, updated_at')
          .order('updated_at', { ascending: false })
          .limit(5);

        if (casesError) throw casesError;

        if (cases) {
          cases.forEach(caseStudy => {
            allActivities.push({
              id: caseStudy.id,
              type: 'case_study',
              title: caseStudy.title,
              action: 'atualizado',
              timestamp: caseStudy.updated_at,
            });
          });
        }

        // Buscar depoimentos recentes
        const { data: testimonials, error: testimonialsError } = await supabase
          .from('testimonials')
          .select('id, client_name, created_at, updated_at')
          .order('updated_at', { ascending: false })
          .limit(5);

        if (testimonialsError) throw testimonialsError;

        if (testimonials) {
          testimonials.forEach(testimonial => {
            allActivities.push({
              id: testimonial.id,
              type: 'testimonial',
              title: `Depoimento de ${testimonial.client_name}`,
              action: 'atualizado',
              timestamp: testimonial.updated_at,
            });
          });
        }

        // Buscar certificações recentes
        const { data: certifications, error: certificationsError } = await supabase
          .from('certifications')
          .select('id, title, created_at, updated_at')
          .order('updated_at', { ascending: false })
          .limit(5);

        if (certificationsError) throw certificationsError;

        if (certifications) {
          certifications.forEach(certification => {
            allActivities.push({
              id: certification.id,
              type: 'certification',
              title: certification.title,
              action: 'atualizado',
              timestamp: certification.updated_at,
            });
          });
        }

        // Ordenar todas as atividades por data e pegar as 10 mais recentes
        const sortedActivities = allActivities
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .slice(0, 10);

        setActivities(sortedActivities);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar atividades recentes:', error);
        toast({
          title: 'Erro ao carregar atividades',
          description: 'Não foi possível carregar as atividades recentes.',
          variant: 'destructive',
        });
        setLoading(false);
      }
    };

    fetchActivities();
  }, [toast]);

  return { activities, loading };
};
