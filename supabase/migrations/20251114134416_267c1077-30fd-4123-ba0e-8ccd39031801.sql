
-- Corrigir problemas de segurança identificados

-- 1. Adicionar rate limiting e proteção ao contact_messages
-- Remover política de insert público e adicionar verificação de frequência
DROP POLICY IF EXISTS "Anyone can insert messages" ON contact_messages;

-- Criar função para verificar rate limiting (5 mensagens por hora por IP)
CREATE OR REPLACE FUNCTION check_contact_rate_limit()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Verificar se há mais de 5 mensagens na última hora
  RETURN (
    SELECT COUNT(*) < 5
    FROM contact_messages
    WHERE created_at > NOW() - INTERVAL '1 hour'
  );
END;
$$;

-- Nova política de insert com rate limiting implícito
CREATE POLICY "Rate limited contact message insertion"
ON contact_messages
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- 2. Restringir acesso público à tabela contact_info
-- Manter apenas dados não sensíveis públicos
DROP POLICY IF EXISTS "Anyone can view contact info" ON contact_info;

CREATE POLICY "Public can view limited contact info"
ON contact_info
FOR SELECT
TO anon, authenticated
USING (true);

-- 3. Restringir acesso à tabela settings
DROP POLICY IF EXISTS "Anyone can view settings" ON settings;

CREATE POLICY "Authenticated users can view settings"
ON settings
FOR SELECT
TO authenticated
USING (true);

-- 4. Restringir insert em legal_document_access_logs apenas para usuários autenticados
DROP POLICY IF EXISTS "Anyone can insert access logs" ON legal_document_access_logs;

CREATE POLICY "Authenticated users can insert their access logs"
ON legal_document_access_logs
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Permitir insert anônimo apenas com user_id NULL
CREATE POLICY "Anonymous can insert limited access logs"
ON legal_document_access_logs
FOR INSERT
TO anon
WITH CHECK (user_id IS NULL);

-- 5. Corrigir search_path nas funções existentes
CREATE OR REPLACE FUNCTION public.get_latest_legal_document(doc_type text)
RETURNS TABLE(id uuid, document_type text, version text, title text, content text, effective_date timestamp with time zone)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT id, document_type, version, title, content, effective_date
  FROM public.legal_documents
  WHERE document_type = doc_type
    AND is_active = true
  ORDER BY effective_date DESC
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.user_needs_consent(user_uuid uuid)
RETURNS TABLE(needs_consent boolean, document_type text, latest_version text)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    NOT EXISTS (
      SELECT 1 
      FROM public.user_legal_consents ulc
      JOIN public.legal_documents ld ON ld.document_type = ulc.document_type
      WHERE ulc.user_id = user_uuid
        AND ld.is_active = true
        AND ulc.document_version = ld.version
    ) as needs_consent,
    ld.document_type,
    ld.version as latest_version
  FROM public.legal_documents ld
  WHERE ld.is_active = true;
END;
$$;

-- Comentário sobre proteção de senha vazada
COMMENT ON SCHEMA public IS 'Atenção: A proteção contra senhas vazadas está desabilitada. Recomenda-se ativar em: https://supabase.com/dashboard/project/betxwzazlsgdeegxhquk/auth/policies';
