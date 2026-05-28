const pool = require('../database');

async function getAllCategories() {
  const result = await pool.query('SELECT * FROM categories ORDER BY category_id');
  return result.rows;
}

module.exports = { getAllCategories };
