import db from '../models/db.js';

const setup = async () => {
  await db.query(`CREATE TABLE IF NOT EXISTS app_user (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user',
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`);

  await db.query(`INSERT INTO app_user (name, email, password_hash, role)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (email) DO NOTHING`,
    ['Admin User', 'admin@example.com', '$2b$10$Jq1KD9MjhcURTuL6iGJ5o.u0fcBPX4UCTPwNFgu7Ig4AxrqbwqvnO', 'admin']);

  console.log('app_user table created and admin account seeded');
  process.exit(0);
};

setup().catch((err) => {
  console.error(err);
  process.exit(1);
});