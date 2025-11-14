-- Adicionar configuração do WhatsApp do rodapé se não existir
INSERT INTO public.settings (key, value) 
VALUES ('footer_whatsapp', '+55 (61) 3032-3436')
ON CONFLICT (key) DO NOTHING;