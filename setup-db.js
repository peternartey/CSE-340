const pool = require('./src/database');

async function setupDatabase() {
  try {
    console.log('Setting up database...');

    // Create table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        category_name TEXT NOT NULL
      )
    `);
    console.log('✓ Created categories table');

    // Insert sample data
    await pool.query(`
      INSERT INTO categories (category_name)
      VALUES
        ('Environmental'),
        ('Educational'),
        ('Community Service'),
        ('Health and Wellness')
      ON CONFLICT DO NOTHING
    `);
    console.log('✓ Inserted sample data');

    // Verify
    const result = await pool.query('SELECT * FROM categories');
    console.log(`✓ Database ready with ${result.rows.length} categories:`);
    result.rows.forEach(row => console.log(`  - ${row.category_name}`));

    process.exit(0);
  } catch (error) {
    console.error('✗ Setup failed:', error.message);
    process.exit(1);
  }
}

setupDatabase();
