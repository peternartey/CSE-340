const categoryModel = require("../models/categoriesModel");

// Show category details page
async function showCategoryDetailsPage(req, res) {
  try {
    const categoryId = req.params.id;
    const category = await categoryModel.getCategoryById(categoryId);
    const projects = await categoryModel.getProjectsForCategory(categoryId);

    if (!category) {
      return res.status(404).render("404", { title: "Not Found", message: "Category not found." });
    }

    res.render("category", { category, projects });
  } catch (err) {
    console.error(err);
    res.status(500).render("500", { title: "Server Error", message: "Unable to load category details." });
  }
}

module.exports = { showCategoryDetailsPage };
