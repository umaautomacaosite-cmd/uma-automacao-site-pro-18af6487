import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AdminStats {
  activeServices: number;
  publishedCases: number;
  activeUsers: number;
  loading: boolean;
}

export const useAdminStats = () => {
  const [stats, setStats] = useState<AdminStats>({
    activeServices: 0,
    publishedCases: 0,
    activeUsers: 0,
    loading: true,
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Buscar serviços ativos
        const { count: servicesCount, error: servicesError } = await supabase
          .from('services')
          .select('*', { count: 'exact', head: true })
          .eq('is_active', true);

        if (servicesError) throw servicesError;

        // Buscar cases publicados
        const { count: casesCount, error: casesError } = await supabase
          .from('case_studies')
          .select('*', { count: 'exact', head: true })
          .eq('is_active', true);

        if (casesError) throw casesError;

        // Buscar usuários ativos
        const { count: usersCount, error: usersError } = await supabase
          .from('user_roles')
          .select('*', { count: 'exact', head: true });

        if (usersError) throw usersError;

        setStats({
          activeServices: servicesCount || 0,
          publishedCases: casesCount || 0,
          activeUsers: usersCount || 0,
          loading: false,
        });
      } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
        toast({
          title: 'Erro ao carregar estatísticas',
          description: 'Não foi possível carregar as estatísticas do dashboard.',
          variant: 'destructive',
        });
        setStats(prev => ({ ...prev, loading: false }));
      }
    };

    fetchStats();
  }, [toast]);

  return stats;
};
