import 'dotenv/config';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DB_URL,
  ssl: { rejectUnauthorized: false }
});

const sql = `
ALTER TABLE organizations
  ADD COLUMN IF NOT EXISTS contact_email VARCHAR(255) NOT NULL DEFAULT '';
ALTER TABLE organizations
  ADD COLUMN IF NOT EXISTS logo_filename VARCHAR(255) NOT NULL DEFAULT 'placeholder-logo.png';
ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS location VARCHAR(200) NOT NULL DEFAULT '';
ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS project_date DATE NOT NULL DEFAULT CURRENT_DATE;
`;

try {
  await pool.query(sql);
  console.log('Altered schema successfully');
} catch (error) {
  console.error('Schema alteration failed:', error);
} finally {
  await pool.end();
}
