// routes/api/main/getavatar.js

var Account = require('../../../models/account');

module.exports = function(req, res) {
	Account.findOne({'username': req.params.username}, {
		avatar: 1, 
	}, function(err, data) {
		if (err) {
			res.sendStatus(404);
		}
		res.json(data);
	});
};