


exports.setSessionUser = function(req, user) {
	if (user != null) {
		req.session.user = JSON.stringify(user);
	}
	else {
		req.session.user = null;
	}
};


exports.getSessionUser = function(req) {
	if (req.session.user != null) {
		var sessionUser = JSON.parse(req.session.user);
		return sessionUser;
	}
	else {
		return null;
	}
};