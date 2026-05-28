const express = require("express");
const path = require("path");
const categoriesModel = require("./src/models/categories");
const pool = require("./src/database");

const app = express();
const PORT = process.env.PORT || 3000;

// Static files
app.use(express.static(path.join(__dirname, "public")));

// EJS setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Dynamic year
const currentYear = new Date().getFullYear();

// Routes
app.get("/", (req, res) => {
  res.render("home", { title: "Home", currentYear });
});

app.get("/organizations", (req, res) => {
  res.render("organizations", { title: "Organizations", currentYear });
});

app.get("/projects", (req, res) => {
  res.render("projects", { title: "Projects", currentYear });
});

app.get("/categories", async (req, res) => {
  try {
    const categories = await categoriesModel.getAllCategories();
    res.render("categories", { title: "Categories", categories, currentYear });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// Database check route
app.get("/db-check", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ status: "✅ Database connected", timestamp: result.rows[0].now });
  } catch (error) {
    res.status(500).json({ status: "❌ Database connection failed", error: error.message });
  }
});

// Error handling middleware (add here)

// 404 handler
app.use((req, res) => {
  res.status(404).render("404", {
    title: "Page Not Found",
    message: "The page you requested does not exist.",
    currentYear: new Date().getFullYear()
  });
});

// 500 handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("500", {
    title: "Server Error",
    message: "Something went wrong.",
    currentYear: new Date().getFullYear()
  });
});


// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
