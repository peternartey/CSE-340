const pool = require('./src/database');

async function checkTables() {
  try {
    const tables = await pool.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema='public'"
    );
    console.log('Existing tables:', tables.rows.map(r => r.table_name));

    // Check categories table structure
    const catColumns = await pool.query(
      "SELECT column_name, data_type FROM information_schema.columns WHERE table_name='categories'"
    );
    console.log('\nCategories columns:', catColumns.rows);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkTables();
