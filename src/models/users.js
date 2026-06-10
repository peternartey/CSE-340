import db from './db.js';

const getAllUsers = async () => {
  const result = await db.query(
    'SELECT user_id, name, email, role FROM app_user ORDER BY name ASC'
  );
  return result.rows;
};

const getUserByEmail = async (email) => {
  const result = await db.query(
    'SELECT * FROM app_user WHERE email = $1',
    [email]
  );
  return result.rows[0];
};

const getUserById = async (id) => {
  const result = await db.query(
    'SELECT * FROM app_user WHERE user_id = $1',
    [id]
  );
  return result.rows[0];
};

const createUser = async ({ name, email, passwordHash, role = 'user' }) => {
  const result = await db.query(
    'INSERT INTO app_user (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING user_id, name, email, role',
    [name, email, passwordHash, role]
  );
  return result.rows[0];
};

export { getAllUsers, getUserByEmail, getUserById, createUser };