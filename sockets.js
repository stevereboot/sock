var io = require('socket.io');

module.exports.listen = function(app){
    io = io.listen(app);

	io.on('connection', function(socket){
	  console.log('a user connected');

		socket.on('chat_message', function(msg){
			server_time = new Date();
			msg.time = server_time.getTime();

			io.emit('chat_message', msg);
		});
	});

    return io
}

