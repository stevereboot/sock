// routes/api/auth/get.js

module.exports = function(req, res) {
	if (req.user) {
		res.send({
			username: req.user.username,
			id: req.user._id
		});
	} else {
		res.send(false);
	}
}