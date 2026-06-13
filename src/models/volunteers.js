import db from './db.js';

const addVolunteer = async (userId, projectId) => {
  const query = `
    INSERT INTO project_volunteer (user_id, project_id)
    VALUES ($1, $2)
    ON CONFLICT DO NOTHING
    RETURNING user_id, project_id
  `;

  const result = await db.query(query, [userId, projectId]);
  return result.rows[0] || null;
};

const removeVolunteer = async (userId, projectId) => {
  const query = `DELETE FROM project_volunteer WHERE user_id = $1 AND project_id = $2 RETURNING user_id, project_id`;
  const result = await db.query(query, [userId, projectId]);
  return result.rows[0] || null;
};

const isUserVolunteerForProject = async (userId, projectId) => {
  const query = `SELECT 1 FROM project_volunteer WHERE user_id = $1 AND project_id = $2 LIMIT 1`;
  const result = await db.query(query, [userId, projectId]);
  return result.rows.length > 0;
};

const getUserVolunteerProjects = async (userId) => {
  const query = `
    SELECT p.project_id, p.project_name AS title, p.project_description AS description, p.location, p.project_date, p.organization_id, o.organization_name AS organization_name
    FROM projects p
    JOIN project_volunteer pv ON p.project_id = pv.project_id
    JOIN organizations o ON p.organization_id = o.organization_id
    WHERE pv.user_id = $1
    ORDER BY p.project_date DESC
  `;

  const result = await db.query(query, [userId]);
  return result.rows;
};

export { addVolunteer, removeVolunteer, isUserVolunteerForProject, getUserVolunteerProjects };
