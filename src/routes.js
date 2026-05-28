const express = require("express");
const router = express.Router();
const categoryController = require("./controllers/categories");
const projectController = require("./controllers/projects");

router.get("/categories", categoryController.showCategoriesPage); // already exists
router.get("/category/:id", categoryController.showCategoryDetailsPage);
router.get("/project/:id", projectController.showProjectDetailsPage);

module.exports = router;
