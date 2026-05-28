const pool = require("../database");

const getAllCategories = async () => {

  const sql = `
    SELECT *
    FROM categories
    ORDER BY category_name
  `;

  const result = await pool.query(sql);

  return result.rows;
};

module.exports = {
  getAllCategories
};