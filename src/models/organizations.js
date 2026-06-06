import db from './db.js'

const getAllOrganizations = async () => {
	if (!db) {
		return [];
	}

	const query = `
        SELECT 
            organization_id,
            organization_name AS name,
            organization_description AS description,
            '' AS contact_email,
            'placeholder-logo.png' AS logo_filename
        FROM public.organizations;
    `;

	const result = await db.query(query);

	return result.rows;
}

const getOrganizationDetails = async (organizationId) => {
	if (!db) {
		return null;
	}
	const query = `
        SELECT
            organization_id,
            organization_name AS name,
            organization_description AS description,
            '' AS contact_email,
            'placeholder-logo.png' AS logo_filename
        FROM public.organizations
        WHERE organization_id = $1;
    `;

	const queryParams = [organizationId];

	const result = await db.query(query, queryParams);

	return result.rows.length > 0
		? result.rows[0]
		: null;
};

/**
	* Creates a new organization in the database.
	*/
const createOrganization = async (
	name,
	description,
	contactEmail,
	logoFilename
) => {

	const query = `
        INSERT INTO organizations (
            organization_name,
            organization_description
        )
        VALUES ($1, $2)
        RETURNING organization_id;
    `;

	const queryParams = [
		name,
		description
	];

	const result =
		await db.query(query, queryParams);

	if (result.rows.length === 0) {

		throw new Error(
			'Failed to create organization'
		);

	}

	if (
		process.env.ENABLE_SQL_LOGGING === 'true'
	) {

		console.log(
			'Created new organization with ID:',
			result.rows[0].organization_id
		);

	}

	return result.rows[0].organization_id;

};

const updateOrganization = async (
	organizationId,
	name,
	description
) => {

	const query = `
        UPDATE public.organizations
        SET
            organization_name = $1,
            organization_description = $2
        WHERE organization_id = $3
        RETURNING organization_id;
    `;

	const queryParams = [
		name,
		description,
		organizationId
	];

	const result = await db.query(
			query,
			queryParams
		);

	if (
		result.rows.length === 0
	) {

		throw new Error(
			'Organization not found'
		);

	}

	if (
		process.env
			.ENABLE_SQL_LOGGING ===
		'true'
	) {

		console.log(
			'Updated organization with ID:',
			organizationId
		);

	}

	return result.rows[0]
		.organization_id;

};

export {
	getAllOrganizations,
	getOrganizationDetails, 
	createOrganization, 
	updateOrganization
};