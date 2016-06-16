// routes/api/auth/logout.js

module.exports = function(req, res) {
	req.logout();
	res.send(null);
}