-- Create legal documents table for versioning Terms and Privacy Policy
CREATE TABLE public.legal_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_type TEXT NOT NULL CHECK (document_type IN ('terms_of_service', 'privacy_policy')),
  version TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  effective_date TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  is_active BOOLEAN DEFAULT false,
  UNIQUE(document_type, version)
);

-- Create user consents table to track user acceptances
CREATE TABLE public.user_legal_consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  document_id UUID REFERENCES public.legal_documents(id),
  document_type TEXT NOT NULL,
  document_version TEXT NOT NULL,
  consented_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  ip_address TEXT,
  user_agent TEXT,
  cookie_preferences JSONB DEFAULT '{"essential": true, "analytics": false, "marketing": false}'::jsonb
);

-- Create document access logs table
CREATE TABLE public.legal_document_access_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  document_id UUID REFERENCES public.legal_documents(id),
  document_type TEXT NOT NULL,
  access_type TEXT NOT NULL CHECK (access_type IN ('view', 'download', 'consent')),
  accessed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  ip_address TEXT,
  user_agent TEXT
);

-- Create data export requests table (LGPD right)
CREATE TABLE public.data_export_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  completed_at TIMESTAMP WITH TIME ZONE,
  download_url TEXT,
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.legal_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_legal_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legal_document_access_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_export_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for legal_documents
CREATE POLICY "Anyone can view active legal documents"
  ON public.legal_documents FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage legal documents"
  ON public.legal_documents FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for user_legal_consents
CREATE POLICY "Users can view their own consents"
  ON public.user_legal_consents FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own consents"
  ON public.user_legal_consents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all consents"
  ON public.user_legal_consents FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for legal_document_access_logs
CREATE POLICY "Users can view their own access logs"
  ON public.legal_document_access_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can insert access logs"
  ON public.legal_document_access_logs FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view all access logs"
  ON public.legal_document_access_logs FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for data_export_requests
CREATE POLICY "Users can view their own export requests"
  ON public.data_export_requests FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own export requests"
  ON public.data_export_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all export requests"
  ON public.data_export_requests FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- Create indexes for performance
CREATE INDEX idx_legal_documents_type_active ON public.legal_documents(document_type, is_active);
CREATE INDEX idx_user_consents_user_id ON public.user_legal_consents(user_id);
CREATE INDEX idx_user_consents_document ON public.user_legal_consents(document_type, document_version);
CREATE INDEX idx_access_logs_user_id ON public.legal_document_access_logs(user_id);
CREATE INDEX idx_access_logs_document_id ON public.legal_document_access_logs(document_id);
CREATE INDEX idx_export_requests_user_id ON public.data_export_requests(user_id);
CREATE INDEX idx_export_requests_status ON public.data_export_requests(status);

-- Create function to get latest document version
CREATE OR REPLACE FUNCTION public.get_latest_legal_document(doc_type TEXT)
RETURNS TABLE (
  id UUID,
  document_type TEXT,
  version TEXT,
  title TEXT,
  content TEXT,
  effective_date TIMESTAMP WITH TIME ZONE
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id, document_type, version, title, content, effective_date
  FROM public.legal_documents
  WHERE document_type = doc_type
    AND is_active = true
  ORDER BY effective_date DESC
  LIMIT 1;
$$;

-- Create function to check if user needs to re-consent
CREATE OR REPLACE FUNCTION public.user_needs_consent(user_uuid UUID)
RETURNS TABLE (
  needs_consent BOOLEAN,
  document_type TEXT,
  latest_version TEXT
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
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