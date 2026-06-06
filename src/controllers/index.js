const showHomePage = (req, res) => {

	const title = 'CSE 340 Service Network';

	res.render('home', { title });

};

export { showHomePage };