
-- Adicionar constraint UNIQUE na coluna key da tabela settings
-- Isso permitirá que o upsert funcione corretamente

-- Primeiro, remover duplicatas se existirem
DELETE FROM settings a USING settings b
WHERE a.id > b.id AND a.key = b.key;

-- Adicionar constraint UNIQUE
ALTER TABLE settings ADD CONSTRAINT settings_key_unique UNIQUE (key);
