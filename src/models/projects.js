import db from './db.js';

const getAllProjects = async () => {
	if (!db) {
		return [];
	}

	const query = `
        SELECT
            p.project_id,
            p.project_name AS title,
            p.project_description AS description,
            p.location,
            p.project_date,
            o.organization_name AS organization_name
        FROM public.projects p
        JOIN public.organizations o
            ON p.organization_id = o.organization_id
        ORDER BY p.project_id;
    `;

	const result = await db.query(query);

	return result.rows;
};

const getProjectsByOrganizationId = async (organizationId) => {
	if (!db) {
		return [];
	}

	const query = `
        SELECT
            project_id,
            organization_id,
            project_name AS title,
            project_description AS description,
            location,
            project_date
        FROM projects
        WHERE organization_id = $1
        ORDER BY project_id;
    `;

	const queryParams = [organizationId];

	const result = await db.query(query, queryParams);

	return result.rows;
};

const getUpcomingProjects = async (number_of_projects) => {
	if (!db) {
		return [];
	}

	const query = `
        SELECT
            p.project_id,
            p.project_name AS title,
            p.project_description AS description,
            p.location,
            p.project_date,
            p.organization_id,
            o.organization_name AS organization_name
        FROM projects p
        JOIN organizations o
            ON p.organization_id = o.organization_id
        ORDER BY p.project_id ASC
        LIMIT $1;
    `;

	const queryParams = [number_of_projects];

	const result = await db.query(query, queryParams);

	return result.rows;
};

const getProjectDetails = async (id) => {
	if (!db) {
		return null;
	}

	const query = `
        SELECT
            p.project_id,
            p.project_name AS title,
            p.project_description AS description,
            p.location,
            p.project_date,
            p.organization_id,
            o.organization_name AS organization_name
        FROM projects p
        JOIN organizations o
            ON p.organization_id = o.organization_id
        WHERE p.project_id = $1;
    `;

	const queryParams = [id];

	const result = await db.query(query, queryParams);

	return result.rows.length > 0
		? result.rows[0]
		: null;
};

const getCategoriesByProjectId = async (projectId) => {
	if (!db) {
		return [];
	}

	const query = `
        SELECT
            c.category_id,
            c.category_name AS name
        FROM categories c
        JOIN project_categories pc
            ON c.category_id = pc.category_id
        WHERE pc.project_id = $1
        ORDER BY c.category_name;
    `;

	const queryParams = [projectId];

	const result = await db.query(query, queryParams);

	return result.rows;
};

const createProject = async (
	title,
	description,
	location,
	date,
	organizationId
) => {

	const query = `
		INSERT INTO projects (
			project_name,
			project_description,
			location,
			project_date,
			organization_id
		)
		VALUES (
			$1,
			$2,
			$3,
			$4,
			$5
		)
		RETURNING project_id;
	`;

	const queryParams = [
		title,
		description,
		location,
		date,
		organizationId
	];

	const result =
		await db.query(
			query,
			queryParams
		);

	if (
		result.rows.length === 0
	) {

		throw new Error(
			'Failed to create project'
		);

	}

	if (
		process.env
			.ENABLE_SQL_LOGGING ===
		'true'
	) {

		console.log(
			'Created new project with ID:',
			result.rows[0].project_id
		);

	}

	return result.rows[0]
		.project_id;

};

const updateProject = async (
	projectId,
	title,
	description,
	location,
	date,
	organizationId
) => {

	const query = `
        UPDATE projects
        SET
            project_name = $1,
            project_description = $2,
            location = $3,
            project_date = $4,
            organization_id = $5
        WHERE project_id = $6
        RETURNING project_id;
    `;

	const queryParams = [
		title,
		description,
		location,
		date,
		organizationId,
		projectId
	];

	const result =
		await db.query(
			query,
			queryParams
		);

	if (
		result.rows.length === 0
	) {

		throw new Error(
			'Project not found'
		);

	}

	if (
		process.env
			.ENABLE_SQL_LOGGING ===
		'true'
	) {

		console.log(
			'Updated project with ID:',
			projectId
		);

	}

	return result.rows[0]
		.project_id;

};

export {
	getAllProjects,
	getProjectsByOrganizationId,
	getUpcomingProjects,
	getProjectDetails,
	getCategoriesByProjectId,
	createProject,
	updateProject
};
