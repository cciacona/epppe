ALTER TABLE reviews ADD COLUMN status TEXT NOT NULL DEFAULT 'Candidate';
ALTER TABLE reviews ADD COLUMN format TEXT NOT NULL DEFAULT 'Series';
ALTER TABLE reviews ADD COLUMN release_date TEXT;
ALTER TABLE reviews ADD COLUMN runtime TEXT;
ALTER TABLE reviews ADD COLUMN votes TEXT;

UPDATE reviews
SET format = category
WHERE category IS NOT NULL
  AND category <> ''
  AND category <> 'Media';
