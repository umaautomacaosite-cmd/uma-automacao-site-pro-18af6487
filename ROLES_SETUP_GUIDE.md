# Guia de Configuração do Sistema de Roles

Este documento explica como configurar e usar o sistema de controle de acesso baseado em roles (Admin, Moderator, User) no painel administrativo.

## 📋 Passo 1: Executar o Script SQL

Antes de usar o sistema de roles, você precisa executar o script SQL que cria as funções e políticas necessárias.

1. Acesse o **SQL Editor** no painel do Supabase
2. Abra o arquivo `supabase/setup-user-roles.sql` deste projeto
3. Copie todo o conteúdo do arquivo
4. Cole no SQL Editor do Supabase
5. Clique em **Run** para executar o script

### O que o script faz:

- ✅ Cria a função `has_role()` para verificar se um usuário tem uma role específica
- ✅ Cria a função `is_admin()` para verificar se um usuário é administrador
- ✅ Cria a função `get_user_roles()` para obter todas as roles de um usuário
- ✅ Configura as políticas RLS (Row Level Security) para proteger a tabela `user_roles`
- ✅ Cria a função `list_users_with_roles()` para listar usuários (apenas para admins)

## 👥 Passo 2: Adicionar o Primeiro Admin

Após executar o script SQL, você precisa adicionar manualmente o primeiro usuário admin. Execute este comando no SQL Editor:

```sql
-- Substitua 'SEU_USER_ID_AQUI' pelo ID do seu usuário
-- Você pode encontrar seu user_id na tabela auth.users
INSERT INTO public.user_roles (user_id, role)
VALUES ('SEU_USER_ID_AQUI', 'admin');
```

Para descobrir seu user_id, execute:

```sql
SELECT id, email FROM auth.users;
```

## 🎯 Níveis de Acesso

### 🔴 Admin (Administrador)
- **Permissões**: Acesso total
- **Pode fazer**:
  - Ver, criar, editar e excluir todos os conteúdos
  - Gerenciar usuários e atribuir roles
  - Acessar todas as abas do painel administrativo

### 🔵 Moderator (Moderador)
- **Permissões**: Edição sem exclusão
- **Pode fazer**:
  - Ver todos os conteúdos
  - Criar e editar conteúdos (serviços, cases, depoimentos, etc.)
  - Ativar/desativar conteúdos
- **Não pode fazer**:
  - Excluir conteúdos
  - Acessar gestão de usuários

### ⚪ User (Usuário)
- **Permissões**: Apenas visualização
- **Pode fazer**:
  - Ver todos os conteúdos do painel
  - Visualizar estatísticas e atividades
- **Não pode fazer**:
  - Editar ou excluir qualquer conteúdo
  - Criar novos conteúdos
  - Acessar gestão de usuários

## 🔧 Como Gerenciar Roles

### Acessar a Gestão de Usuários

1. Faça login no painel administrativo
2. Certifique-se de ter role de **Admin**
3. Clique na aba **"Usuários"**

### Adicionar Role a um Usuário

1. Na aba Usuários, localize o usuário desejado
2. Clique no dropdown **"Adicionar"**
3. Selecione a role desejada (Admin, Moderator ou User)
4. A role será adicionada imediatamente

### Remover Role de um Usuário

1. Na aba Usuários, localize o usuário
2. Clique no dropdown **"Remover"**
3. Selecione a role que deseja remover
4. Confirme a remoção

### Buscar e Filtrar Usuários

- Use a **barra de busca** para procurar usuários por email
- Use o **filtro de roles** para exibir apenas usuários com uma role específica

## 🛡️ Segurança

### Políticas RLS Implementadas

O sistema usa Row Level Security (RLS) do Supabase para garantir que:

- ✅ Apenas administradores podem ver e gerenciar a tabela `user_roles`
- ✅ Usuários não podem se auto-promover a admin
- ✅ Todas as verificações de permissão são feitas no servidor (SECURITY DEFINER)
- ✅ Não há possibilidade de bypass via cliente

### Verificações no Frontend

O sistema também implementa verificações no frontend para melhorar a UX:

- Botões de edição são **desabilitados** para usuários sem permissão
- Botões de exclusão são **visíveis apenas para admins**
- A aba Usuários é **acessível apenas para admins**

## 📝 Componentes Atualizados

Os seguintes componentes já estão configurados com controle de acesso:

- ✅ `AdminUsers.tsx` - Gestão de usuários (apenas admin)
- ✅ `AdminServices.tsx` - Gestão de serviços (com controle de edição/exclusão)
- ✅ `AdminCaseStudies.tsx` - Gestão de cases (com controle de edição/exclusão)
- ⚠️ Outros componentes admin devem ser atualizados seguindo o mesmo padrão

## 🔍 Hook useUserRole

Um hook customizado foi criado para facilitar a verificação de permissões:

```typescript
import { useUserRole } from '@/hooks/useUserRole';

function MeuComponente() {
  const { isAdmin, isModerator, canEdit, canDelete, loading } = useUserRole();
  
  return (
    <div>
      <Button disabled={!canEdit}>Editar</Button>
      <Button disabled={!canDelete}>Excluir</Button>
    </div>
  );
}
```

### Propriedades do Hook

- `roles`: Array com todas as roles do usuário
- `isAdmin`: Boolean - usuário é admin
- `isModerator`: Boolean - usuário é moderator
- `isUser`: Boolean - usuário tem role user
- `canEdit`: Boolean - pode editar (admin ou moderator)
- `canDelete`: Boolean - pode excluir (apenas admin)
- `loading`: Boolean - carregando dados de role
- `refreshRoles()`: Função para recarregar as roles

## 🚨 Troubleshooting

### "Acesso negado" ao acessar Usuários

**Problema**: Você não tem role de admin atribuída.

**Solução**: Execute o comando SQL do Passo 2 para se adicionar como admin.

### Botões continuam habilitados após remover role

**Problema**: O hook useUserRole não atualizou.

**Solução**: Faça logout e login novamente, ou recarregue a página.

### Erro ao executar o script SQL

**Problema**: O enum `app_role` ou a tabela `user_roles` não existem.

**Solução**: Verifique se você tem as migrations corretas aplicadas no seu projeto Supabase.

## 📞 Suporte

Para mais informações sobre o sistema de roles e permissões, consulte a documentação do Supabase sobre:
- [Row Level Security (RLS)](https://supabase.com/docs/guides/auth/row-level-security)
- [Security Definer Functions](https://supabase.com/docs/guides/database/functions)
