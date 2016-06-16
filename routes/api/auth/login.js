// routes/api/auth/login.js

var passport = require('passport');

module.exports = function(req, res) {
	passport.authenticate('local', function(err, user) {
		req.logIn(user, function(err) {
			if (err) {
				console.log(err);
			}

			res.send(user.username || false);
		});
	})(req, res);
}