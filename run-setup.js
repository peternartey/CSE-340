const pool = require('./src/database');
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
  try {
    console.log('Running setup.sql...');
    
    // Read the setup SQL file
    const sqlPath = path.join(__dirname, 'src', 'setup.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    // Execute the SQL
    await pool.query(sql);
    
    console.log('✓ Database setup complete!');
    
    // Verify data
    const categories = await pool.query('SELECT * FROM categories ORDER BY category_name');
    console.log(`✓ Categories (${categories.rows.length}):`);
    categories.rows.forEach(cat => console.log(`  - ${cat.category_name}`));
    
    const orgs = await pool.query('SELECT * FROM organizations');
    console.log(`✓ Organizations (${orgs.rows.length}):`);
    orgs.rows.forEach(org => console.log(`  - ${org.organization_name}`));
    
    const projects = await pool.query('SELECT * FROM projects');
    console.log(`✓ Projects (${projects.rows.length}):`);
    projects.rows.forEach(proj => console.log(`  - ${proj.project_name}`));
    
    process.exit(0);
  } catch (error) {
    console.error('✗ Setup failed:', error.message);
    process.exit(1);
  }
}

setupDatabase();
