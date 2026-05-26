require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.PGUSER || "postgres",
  host: process.env.PGHOST || "localhost",
  database: process.env.PGDATABASE || "cse340",
  password: process.env.PGPASSWORD || "",
  port: Number(process.env.PGPORT || 5432),
  ssl: process.env.PGSSLMODE === "require" ? { rejectUnauthorized: false } : false
});

module.exports = pool;