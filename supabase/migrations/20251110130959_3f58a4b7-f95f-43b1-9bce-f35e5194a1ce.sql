-- Adicionar campos de ano inicial e final para cases
ALTER TABLE case_studies 
ADD COLUMN start_year text,
ADD COLUMN end_year text;

-- Migrar dados existentes do campo year para start_year
UPDATE case_studies 
SET start_year = year, end_year = year 
WHERE year IS NOT NULL;

-- Comentário: O campo 'year' antigo ainda existe para compatibilidade, mas start_year e end_year são os novos campos preferidos