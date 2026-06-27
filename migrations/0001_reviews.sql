CREATE TABLE IF NOT EXISTS reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  reviewer TEXT,
  category TEXT NOT NULL DEFAULT 'Media',
  rating INTEGER CHECK (rating IS NULL OR (rating >= 1 AND rating <= 5)),
  external_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_published INTEGER NOT NULL DEFAULT 1 CHECK (is_published IN (0, 1)),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_reviews_public_order
  ON reviews (is_published, sort_order DESC, created_at DESC);
