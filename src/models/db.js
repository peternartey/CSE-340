import 'dotenv/config';
import { Pool } from 'pg';

/**
 * Build PostgreSQL pool configuration
 */
const databaseUrl = process.env.DB_URL || process.env.DATABASE_URL;

if (!databaseUrl) {
  console.warn('Warning: DB_URL or DATABASE_URL is not set. Database connections will fail until this value is provided.');
}

const poolConfig = {
  connectionString: databaseUrl,
};

const explicitSsl = [
  process.env.DB_SSL,
  process.env.PGSSLMODE,
].some(value => value?.toLowerCase() === 'true');

const remoteDatabaseUrl = databaseUrl && !databaseUrl.match(/@(localhost|127\.0\.0\.1)(:|\/)/);
const enableSsl = explicitSsl || Boolean(databaseUrl && remoteDatabaseUrl);

if (enableSsl) {
  poolConfig.ssl = {
    rejectUnauthorized: false,
  };
}

const pool = databaseUrl ? new Pool(poolConfig) : null;

let db = null;

/**
 * Development logging wrapper (optional)
 */
if (
	databaseUrl &&
	process.env.NODE_ENV === 'development' &&
	process.env.ENABLE_SQL_LOGGING === 'true'
) {
	db = {
		async query(text, params) {
			try {
				const start = Date.now();
				const res = await pool.query(text, params);
				const duration = Date.now() - start;

				console.log('Executed query:', {
					text: text.replace(/\s+/g, ' ').trim(),
					duration: `${duration}ms`,
					rows: res.rowCount
				});

				return res;
			} catch (error) {
				console.error('Error in query:', {
					text: text.replace(/\s+/g, ' ').trim(),
					error: error.message
				});
				throw error;
			}
		},

		async close() {
			await pool.end();
		}
	};
} else {
	db = pool;
}

/**
 * Test database connection
 */
const testConnection = async () => {
	if (!db) {
		throw new Error('Database is not configured. Set DB_URL or DATABASE_URL to enable database access.');
	}

	try {
		const result = await db.query('SELECT NOW() as current_time');
		console.log('Database connection successful:', result.rows[0].current_time);
		return true;
	} catch (error) {
		console.error('Database connection failed:', error.message);
		throw error;
	}
};

const hasDatabaseConfig = Boolean(databaseUrl);

export default db;
export { testConnection, hasDatabaseConfig };
