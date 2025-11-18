import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface RecentActivity {
  id: string;
  entity_type: string;
  entity_name: string;
  action_type: string;
  created_at: string;
}

export const useRecentActivities = () => {
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchActivities = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_activity_log')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setActivities(data || []);
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

  const deleteActivity = async (activityId: string) => {
    try {
      const { error } = await supabase
        .from('admin_activity_log')
        .delete()
        .eq('id', activityId);

      if (error) throw error;

      setActivities(prev => prev.filter(activity => activity.id !== activityId));
      
      toast({
        title: 'Atividade removida',
        description: 'A atividade foi removida do log com sucesso.',
      });
    } catch (error) {
      console.error('Erro ao excluir atividade:', error);
      toast({
        title: 'Erro ao excluir',
        description: 'Não foi possível excluir a atividade.',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  return { activities, loading, deleteActivity };
};
