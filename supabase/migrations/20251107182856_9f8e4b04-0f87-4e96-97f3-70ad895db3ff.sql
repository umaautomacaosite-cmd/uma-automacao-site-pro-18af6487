-- Add history paragraphs 4 and 5 to about_content table
ALTER TABLE public.about_content
ADD COLUMN IF NOT EXISTS history_p4 text,
ADD COLUMN IF NOT EXISTS history_p5 text;

-- Update existing history content to use new structure
UPDATE public.about_content
SET 
  history_p4 = 'Com experiência em diversos setores industriais, nossa equipe está preparada para atender desde pequenas empresas até grandes corporações, sempre com o mesmo nível de comprometimento e excelência técnica.',
  history_p5 = 'Nossos projetos seguem rigorosamente as normas regulamentadoras NR-10 e NR-12, garantindo segurança e conformidade em todas as etapas de execução.'
WHERE section_key = 'history';