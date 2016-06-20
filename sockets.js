var io = require('socket.io');
var Account = require('./models/account');

module.exports.listen = function(app) {
	io = io.listen(app);

	io.on('connection', function(socket) {
		// console.log('a user connected');

		socket.on('user_joined', function(msg) {
			server_time = new Date();
			msg.time = server_time.getTime();
						
			io.emit('user_joined', msg);
		});

		socket.on('chat_message', function(msg) {
			server_time = new Date();
			msg.time = server_time.getTime();

			Account.findOne({'username': msg.username}, {
				avatar: 1
			}, function(err, data) {
				if (err) {
					console.log('error');
				}
				msg.avatar = data.avatar;
				
				io.emit('chat_message', msg);
			});
		});
	});

	return io
}



