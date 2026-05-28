const express = require("express");
const router = express.Router();
const projectsController = require("../controllers/projectsController");

// /projects → list of projects
router.get("/", projectsController.getProjects);

// /project/:id → single project details
router.get("/:id", projectsController.getProjectById);

module.exports = router;
