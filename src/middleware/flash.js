const flash = (req, res, next) => {

	if (!req.session.flashMessages) {

		req.session.flashMessages = [];

	}

	req.flash = (type, message) => {

		req.session.flashMessages.push({
			type,
			message
		});

	};

	res.locals.flashMessages = req.session.flashMessages;

	req.session.flashMessages = [];

	next();

};

export default flash;