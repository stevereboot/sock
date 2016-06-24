// routes/api/main/getmessages.js

var Chat = require('../../../models/chat');

module.exports = function(req, res) {
	Chat.find(function(err, data) {
		if (err) {
			res.sendStatus(404);
		}
		res.json(data.reverse());
	}).sort({$natural: -1}).limit(100);
};
