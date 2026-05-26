-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  category_name TEXT NOT NULL
);

-- Insert sample data
INSERT INTO categories (category_name)
VALUES
  ('Environmental'),
  ('Educational'),
  ('Community Service'),
  ('Health and Wellness')
ON CONFLICT DO NOTHING;

-- Verify data
SELECT * FROM categories;
