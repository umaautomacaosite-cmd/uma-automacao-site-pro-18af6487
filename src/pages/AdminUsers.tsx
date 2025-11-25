import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useUserRole } from '@/hooks/useUserRole';
import { Loader2, Search, UserPlus, Trash2, Shield, AlertCircle } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';

type UserRole = Database['public']['Enums']['app_role'];

interface UserWithRoles {
  user_id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  roles: string[];
}

const AdminUsers = () => {
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserWithRoles[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const { toast } = useToast();
  const { isAdmin, loading: roleLoading } = useUserRole();

  useEffect(() => {
    if (!roleLoading) {
      if (isAdmin) {
        fetchUsers();
      } else {
        setLoading(false);
      }
    }
  }, [isAdmin, roleLoading]);

  useEffect(() => {
    filterUsers();
  }, [searchTerm, roleFilter, users]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Usar a função SQL que retorna usuários com emails e roles
      const { data: usersData, error } = await supabase
        .rpc('list_users_with_roles' as any) as { data: UserWithRoles[] | null, error: any };

      if (error) throw error;

      setUsers(usersData || []);
    } catch (error: any) {
      console.error('Erro ao buscar usuários:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao carregar usuários',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];

    // Filtro por busca
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por role
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user =>
        user.roles.includes(roleFilter)
      );
    }

    setFilteredUsers(filtered);
  };

  const addRole = async (userId: string, role: UserRole) => {
    try {
      setActionLoading(`add-${userId}-${role}`);
      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role });

      if (error) throw error;

      toast({
        title: 'Sucesso',
        description: `Role "${role}" adicionada com sucesso`,
      });

      await fetchUsers();
    } catch (error: any) {
      console.error('Erro ao adicionar role:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao adicionar role',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(null);
    }
  };

  const removeRole = async (userId: string, role: UserRole) => {
    try {
      setActionLoading(`remove-${userId}-${role}`);
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', role);

      if (error) throw error;

      toast({
        title: 'Sucesso',
        description: `Role "${role}" removida com sucesso`,
      });

      await fetchUsers();
    } catch (error: any) {
      console.error('Erro ao remover role:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao remover role',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Nunca';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'moderator':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'user':
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'moderator':
        return 'Moderador';
      case 'user':
        return 'Usuário';
      default:
        return role;
    }
  };

  if (roleLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-wine-900" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-red-500" />
            <div>
              <h3 className="font-playfair text-xl font-bold mb-2">Acesso Negado</h3>
              <p className="text-muted-foreground">
                Apenas administradores podem acessar a gestão de usuários.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-playfair text-2xl flex items-center gap-2">
            <Shield className="h-6 w-6" />
            Gestão de Usuários
          </CardTitle>
          <CardDescription>
            Gerencie usuários e suas permissões no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filtrar por role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as roles</SelectItem>
                <SelectItem value="admin">Administradores</SelectItem>
                <SelectItem value="moderator">Moderadores</SelectItem>
                <SelectItem value="user">Usuários</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-wine-900" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum usuário encontrado
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Roles</TableHead>
                    <TableHead>Cadastrado em</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.user_id}>
                      <TableCell className="font-medium">{user.email}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-2">
                          {user.roles.length === 0 ? (
                            <Badge variant="outline">Sem role</Badge>
                          ) : (
                            user.roles.map((role) => (
                              <Badge
                                key={role}
                                className={getRoleBadgeColor(role)}
                              >
                                {getRoleLabel(role)}
                              </Badge>
                            ))
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(user.created_at)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Select
                            onValueChange={(role) => addRole(user.user_id, role as UserRole)}
                            disabled={actionLoading !== null}
                          >
                            <SelectTrigger className="w-32 h-8">
                              <UserPlus className="h-3 w-3 mr-2" />
                              <SelectValue placeholder="Adicionar" />
                            </SelectTrigger>
                            <SelectContent>
                              {!user.roles.includes('admin') && (
                                <SelectItem value="admin">Admin</SelectItem>
                              )}
                              {!user.roles.includes('moderator') && (
                                <SelectItem value="moderator">Moderator</SelectItem>
                              )}
                              {!user.roles.includes('user') && (
                                <SelectItem value="user">User</SelectItem>
                              )}
                            </SelectContent>
                          </Select>

                          {user.roles.length > 0 && (
                            <Select
                              onValueChange={(role) => removeRole(user.user_id, role as UserRole)}
                              disabled={actionLoading !== null}
                            >
                              <SelectTrigger className="w-32 h-8">
                                <Trash2 className="h-3 w-3 mr-2" />
                                <SelectValue placeholder="Remover" />
                              </SelectTrigger>
                              <SelectContent>
                                {user.roles.map((role) => (
                                  <SelectItem key={role} value={role}>
                                    {getRoleLabel(role)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <h3 className="font-playfair text-lg font-semibold mb-3 flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            Níveis de Acesso
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <Badge className="bg-red-100 text-red-800 mt-0.5">Admin</Badge>
              <span>Acesso total ao painel administrativo, incluindo gestão de usuários e todas as operações (criar, editar, excluir)</span>
            </div>
            <div className="flex items-start gap-2">
              <Badge className="bg-blue-100 text-blue-800 mt-0.5">Moderator</Badge>
              <span>Pode editar conteúdos (serviços, cases, depoimentos), mas não pode excluir nem gerenciar usuários</span>
            </div>
            <div className="flex items-start gap-2">
              <Badge className="bg-gray-100 text-gray-800 mt-0.5">User</Badge>
              <span>Apenas visualização do painel administrativo, sem permissões de edição ou exclusão</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsers;
