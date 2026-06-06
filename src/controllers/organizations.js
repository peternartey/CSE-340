import { getAllOrganizations, getOrganizationDetails, createOrganization, updateOrganization } from '../models/organizations.js';
import { getProjectsByOrganizationId } from '../models/projects.js';
import { body, validationResult } from 'express-validator';

// Define validation rules for organization form
const organizationValidation = [
	body('name')
		.trim()
		.notEmpty()
		.withMessage('Organization name is required')
		.isLength({ min: 3, max: 150 })
		.withMessage('Organization name must be between 3 and 150 characters'),

	body('description')
		.trim()
		.notEmpty()
		.withMessage('Organization description is required')
		.isLength({ max: 500 })
		.withMessage('Organization description cannot exceed 500 characters'),

	body('contactEmail')
		.normalizeEmail()
		.notEmpty()
		.withMessage('Contact email is required')
		.isEmail()
		.withMessage('Please provide a valid email address')
];

//	Controller functions for handling organization-related requests:
const showOrganizationsPage = async (req, res) => {

	const organizations = await getAllOrganizations();

	const title = 'Our Partner Organizations';

	res.render('organizations', { title, organizations });
};

//	Show details for a specific organization, including its associated projects
const showOrganizationDetailsPage = async (req, res) => {

	const organizationId = req.params.id;

	const organizationDetails =
		await getOrganizationDetails(organizationId);

	const projects =
		await getProjectsByOrganizationId(organizationId);

	const title = 'Organization Details';

	res.render('organization', {
		title,
		organizationDetails,
		projects
	});

};

//	Show form for adding a new organization
const showNewOrganizationForm = async (req, res) => {

	const title = 'Add New Organization';

	res.render('new-organization', {
		title
	});

};

//	Show form for editing an existing organization
export const showEditOrganizationForm = async (req, res) => {

	const organizationId = req.params.id;

	const organizationDetails = await getOrganizationDetails(organizationId);

	const title = 'Edit Organization';

	res.render('edit-organization',
		{
			title,
			organizationDetails
		}
	);

};

//	Process form submission for adding a new organization, including validation and error handling
const processNewOrganizationForm = async (req, res) => {

	// Check for validation errors
	const results = validationResult(req);

	if (!results.isEmpty()) {

		// Validation failed - loop through errors
		results.array().forEach((error) => {

			req.flash(
				'error',
				error.msg
			);

		});

		// Redirect back to form
		return res.redirect('/new-organization');

	}

	const {
		name,
		description,
		contactEmail
	} = req.body;

	const logoFilename = 'placeholder-logo.png';

	const organizationId =
		await createOrganization(
			name,
			description,
			contactEmail,
			logoFilename
		);

	req.flash(
		'success',
		'Organization added successfully!'
	);

	res.redirect(
		`/organization/${organizationId}`
	);

};

//	Process form submission for editing an existing organization, including validation and error handling
const processEditOrganizationForm = async (req, res) => {

	const organizationId = req.params.id;

	const {
		name,
		description,
		contactEmail
	} = req.body;

	const organizationDetails = await getOrganizationDetails(organizationId);

	const logoFilename = organizationDetails.logo_filename;

	await updateOrganization(
		organizationId,
		name,
		description
	);

	req.flash('success', 'Organization updated successfully!');

	res.redirect(`/organization/${organizationId}`);

};

//	Export controller functions for use in route definitions:
export {
	showOrganizationsPage,
	showOrganizationDetailsPage,
	showNewOrganizationForm,
	processNewOrganizationForm,
	organizationValidation,
	processEditOrganizationForm
};