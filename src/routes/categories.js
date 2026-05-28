// routes/categories.js
const express = require('express');
const router = express.Router();
const pool = require('../db'); // adjust path if your db connection file is elsewhere

// GET /categories - list all categories
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categories ORDER BY category_id');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).send('Server Error');
  }
});

// GET /categories/:id - get a single category by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM categories WHERE category_id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).send('Category not found');
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching category:', err);
    res.status(500).send('Server Error');
  }
});

// POST /categories - add a new category
router.post('/', async (req, res) => {
  try {
    const { category_name } = req.body;
    const result = await pool.query(
      'INSERT INTO categories (category_name) VALUES ($1) RETURNING *',
      [category_name]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error adding category:', err);
    res.status(500).send('Server Error');
  }
});

// PUT /categories/:id - update an existing category
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { category_name } = req.body;
    const result = await pool.query(
      'UPDATE categories SET category_name = $1 WHERE category_id = $2 RETURNING *',
      [category_name, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).send('Category not found');
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating category:', err);
    res.status(500).send('Server Error');
  }
});

// DELETE /categories/:id - remove a category
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM categories WHERE category_id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).send('Category not found');
    }

    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    console.error('Error deleting category:', err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
