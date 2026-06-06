import db from './db.js';

const getAllCategories = async () => {
	if (!db) {
		return [];
	}

	const query = `
        SELECT
            category_id,
            category_name AS name
        FROM public.categories
        ORDER BY category_name;
    `;

	const result = await db.query(query);

	return result.rows;
};

const getCategoryById = async (id) => {
	if (!db) {
		return null;
	}

	const query = `
        SELECT
            category_id,
            category_name AS name
        FROM categories
        WHERE category_id = $1;
    `;

	const queryParams = [id];

	const result = await db.query(query, queryParams);

	return result.rows.length > 0
		? result.rows[0]
		: null;
};

const getProjectsByCategoryId = async (categoryId) => {
	if (!db) {
		return [];
	}

	const query = `
        SELECT
            p.project_id,
            p.project_name AS title
        FROM projects p
        JOIN project_categories pc
            ON p.project_id = pc.project_id
        WHERE pc.category_id = $1
        ORDER BY p.project_id;
    `;

	const queryParams = [categoryId];

	const result = await db.query(query, queryParams);

	return result.rows;
};

const getCategoriesByServiceProjectId = async (projectId) => {
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

	const result = await db.query(
		query,
		[projectId]
	);

	return result.rows;

};

const assignCategoryToProject = async (
	categoryId,
	projectId
) => {

	const query = `
        INSERT INTO project_categories (
            category_id,
            project_id
        )
        VALUES ($1, $2);
    `;

	await db.query(
		query,
		[
			categoryId,
			projectId
		]
	);

};

const updateCategoryAssignments = async (
	projectId,
	categoryIds
) => {

	const deleteQuery = `
        DELETE FROM project_categories
        WHERE project_id = $1;
    `;

	await db.query(
		deleteQuery,
		[projectId]
	);

	for (
		const categoryId
		of categoryIds
	) {

		await assignCategoryToProject(
			categoryId,
			projectId
		);

	}

};

const createCategory = async (
	name
) => {

	const query = `
        INSERT INTO categories (
            category_name
        )
        VALUES (
            $1
        )
        RETURNING category_id;
    `;

	const queryParams = [
		name
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
			'Failed to create category'
		);

	}

	if (
		process.env
			.ENABLE_SQL_LOGGING ===
		'true'
	) {

		console.log(
			'Created category with ID:',
			result.rows[0].category_id
		);

	}

	return result.rows[0]
		.category_id;

};

const updateCategory = async (
	categoryId,
	name
) => {

	const query = `
        UPDATE categories
        SET
            category_name = $1
        WHERE category_id = $2
        RETURNING category_id;
    `;

	const queryParams = [
		name,
		categoryId
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
			'Category not found'
		);

	}

	if (
		process.env
			.ENABLE_SQL_LOGGING ===
		'true'
	) {

		console.log(
			'Updated category with ID:',
			categoryId
		);

	}

	return result.rows[0]
		.category_id;

};

export {
	getAllCategories,
	getCategoryById,
	getProjectsByCategoryId,
	getCategoriesByServiceProjectId,
	updateCategoryAssignments,
	createCategory, 
	updateCategory
};
