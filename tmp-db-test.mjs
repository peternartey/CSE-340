import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const databaseUrl = process.env.DB_URL || process.env.DATABASE_URL;
console.log('databaseUrl:', JSON.stringify(databaseUrl));
console.log('DB_SSL:', process.env.DB_SSL);
console.log('PGSSLMODE:', process.env.PGSSLMODE);
console.log('NODE_ENV:', process.env.NODE_ENV);

const poolConfig = {
  connectionString: databaseUrl,
};

const explicitSsl = [process.env.DB_SSL, process.env.PGSSLMODE].some(value => value?.toLowerCase() === 'true');
const remoteDatabaseUrl = databaseUrl && !databaseUrl.match(/@(localhost|127\.0\.0\.1)(:|\/)/);
const enableSsl = explicitSsl || Boolean(databaseUrl && remoteDatabaseUrl);
console.log('enableSsl:', enableSsl);

if (enableSsl) {
  poolConfig.ssl = { rejectUnauthorized: false };
}

const pool = new Pool(poolConfig);

console.log('poolConfig:', JSON.stringify(poolConfig));

try {
  const res = await pool.query('SELECT NOW()');
  console.log('query ok:', res.rows[0]);
} catch (error) {
  console.error('connect error:', error);
} finally {
  await pool.end();
}
