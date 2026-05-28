const projectsModel = require("../models/projectsModel");

// Show list of upcoming projects
async function getProjects(req, res, next) {
  try {
    const projects = await projectsModel.getUpcomingProjects();
    res.render("projects", {
      title: "Upcoming Service Projects",
      projects
    });
  } catch (err) {
    next(err); // triggers 500.ejs
  }
}

// Show details for a single project
async function getProjectById(req, res, next) {
  try {
    const projectId = req.params.id;
    const project = await projectsModel.getProjectById(projectId);
    const categories = await projectsModel.getCategoriesForProject(projectId);

    if (!project) {
      return res.status(404).render("404", {
        title: "Project Not Found",
        message: "The requested project does not exist."
      });
    }

    res.render("project", {
      title: project.project_name,
      project,
      categories
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getProjects, getProjectById };
