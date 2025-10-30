-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create services table
CREATE TABLE public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL,
  description text NOT NULL,
  applications jsonb DEFAULT '[]'::jsonb,
  standards jsonb DEFAULT '[]'::jsonb,
  features jsonb DEFAULT '[]'::jsonb,
  engineer text NOT NULL,
  icon_type text DEFAULT 'green' CHECK (icon_type IN ('green', 'red')),
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read active services
CREATE POLICY "Anyone can view active services"
ON public.services
FOR SELECT
USING (is_active = true);

-- Only admins can manage services
CREATE POLICY "Admins can manage services"
ON public.services
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Create trigger for updated_at
CREATE TRIGGER update_services_updated_at
BEFORE UPDATE ON public.services
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert existing services
INSERT INTO public.services (title, category, description, applications, standards, features, engineer, icon_type, display_order) VALUES
('Fibra Óptica FTTH/FTTX', 'redes', 'Implantação completa de redes de fibra óptica para telecomunicações e dados corporativos.', 
'["Provedores de Internet", "Condomínios Residenciais", "Complexos Empresariais", "Campus Universitários"]'::jsonb,
'["ANSI/TIA-568", "ISO/IEC 11801", "ABNT NBR 14565", "ITU-T G.652"]'::jsonb,
'["Certificação OTDR", "Fusão de Fibras", "Teste de Atenuação", "Documentação Técnica Completa"]'::jsonb,
'Eng. Carlos Silva - CREA/SP 123456', 'green', 1),

('Cabeamento Estruturado', 'redes', 'Sistemas de cabeamento estruturado categoria 6A/7 para redes corporativas de alta performance.',
'["Escritórios Corporativos", "Indústrias", "Hospitais", "Escolas"]'::jsonb,
'["ANSI/TIA-568.2-D", "ISO/IEC 11801", "ABNT NBR 14565", "NR-10"]'::jsonb,
'["Cat 7/6A/6", "Certificação Fluke", "Patch Panels", "Organização de Racks"]'::jsonb,
'Eng. Maria Santos - CREA/SP 789012', 'green', 2),

('Sistema Busway Trifásico', 'energia', 'Instalação de barramentos blindados para distribuição elétrica industrial de alta corrente.',
'["Indústrias Pesadas", "Data Centers", "Hospitais", "Shopping Centers"]'::jsonb,
'["ABNT NBR 5410", "ABNT NBR 6808", "NR-10", "NR-12"]'::jsonb,
'["800A a 6300A", "IP65", "Baixa Impedância", "Expansão Modular"]'::jsonb,
'Eng. Roberto Lima - CREA/SP 345678', 'green', 3),

('Fechamento de Quadros Elétricos', 'energia', 'Montagem e fechamento de quadros elétricos conforme normas de segurança industrial.',
'["Máquinas Industriais", "Sistemas de Automação", "Painéis de Controle"]'::jsonb,
'["ABNT NBR 5410", "ABNT NBR IEC 60439", "NR-10", "NR-12"]'::jsonb,
'["IP54/IP65", "Disjuntores ABB/Schneider", "Bornes Phoenix", "Identificação Técnica"]'::jsonb,
'Eng. Ana Costa - CREA/SP 901234', 'green', 4),

('Sistemas PLC e SCADA', 'automacao', 'Desenvolvimento de sistemas de automação industrial com PLCs e supervisórios SCADA.',
'["Linhas de Produção", "Sistemas de Tratamento", "Controle de Processos"]'::jsonb,
'["IEC 61131-3", "IEC 61508", "ISA-95", "NR-12"]'::jsonb,
'["Siemens S7", "Rockwell ControlLogix", "Schneider Modicon", "Redundância"]'::jsonb,
'Eng. Pedro Oliveira - CREA/SP 567890', 'red', 5),

('Infraestrutura de Data Center', 'datacenter', 'Projeto e implementação de infraestrutura completa para data centers de missão crítica.',
'["Data Centers Corporativos", "Cloud Providers", "Colocation"]'::jsonb,
'["TIA-942", "ISO 27001", "ABNT NBR 5410", "NR-10"]'::jsonb,
'["Tier III/IV", "UPS Redundante", "CRAC", "Monitoramento 24/7"]'::jsonb,
'Eng. Rafael Almeida - CREA/SP 678901', 'red', 6);