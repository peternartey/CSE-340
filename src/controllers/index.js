import { getUserVolunteerProjects } from '../models/volunteers.js';

const showHomePage = async (req, res) => {

	const title = 'CSE 340 Service Network';

	let volunteerProjects = [];
	if (req.session?.user) {
		volunteerProjects = await getUserVolunteerProjects(req.session.user.id);
	}

	res.render('home', { title, volunteerProjects });

};

export { showHomePage };