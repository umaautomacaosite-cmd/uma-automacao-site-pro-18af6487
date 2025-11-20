import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type UserRole = Database['public']['Enums']['app_role'];

interface UseUserRoleReturn {
  roles: UserRole[];
  isAdmin: boolean;
  isModerator: boolean;
  isUser: boolean;
  canEdit: boolean;
  canDelete: boolean;
  loading: boolean;
  refreshRoles: () => Promise<void>;
}

export const useUserRole = (): UseUserRoleReturn => {
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setRoles([]);
        return;
      }

      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);

      if (error) {
        console.error('Erro ao buscar roles:', error);
        setRoles([]);
        return;
      }

      const userRoles = data?.map(r => r.role) || [];
      setRoles(userRoles);
    } catch (error) {
      console.error('Erro ao buscar roles:', error);
      setRoles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();

    // Subscrever mudanças nas roles do usuário
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        fetchRoles();
      } else if (event === 'SIGNED_OUT') {
        setRoles([]);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const isAdmin = roles.includes('admin');
  const isModerator = roles.includes('moderator');
  const isUser = roles.includes('user');

  // Permissões derivadas
  const canEdit = isAdmin || isModerator;
  const canDelete = isAdmin;

  return {
    roles,
    isAdmin,
    isModerator,
    isUser,
    canEdit,
    canDelete,
    loading,
    refreshRoles: fetchRoles,
  };
};
