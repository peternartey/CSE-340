import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const pool = new Pool({ connectionString: process.env.DB_URL, ssl: { rejectUnauthorized: false }});
const tables = ['organizations','projects','categories'];
for (const table of tables) {
  const res = await pool.query(
    'SELECT column_name, data_type FROM information_schema.columns WHERE table_schema = $1 AND table_name = $2 ORDER BY ordinal_position',
    ['public', table]
  );
  console.log('TABLE', table);
  console.log(JSON.stringify(res.rows, null, 2));
}
await pool.end();
