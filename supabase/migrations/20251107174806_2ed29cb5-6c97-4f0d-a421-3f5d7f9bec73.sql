-- Adicionar entradas para parágrafos adicionais na página Sobre
INSERT INTO public.about_content (section_key, title, content, display_order, is_active) VALUES
  ('history_p2', 'História - Parágrafo 2', 'Texto adicional sobre a história da empresa.', 1, true),
  ('history_p3', 'História - Parágrafo 3', 'Mais detalhes sobre a trajetória da empresa.', 2, true)
ON CONFLICT (section_key) DO NOTHING;