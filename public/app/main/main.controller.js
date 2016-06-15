// public/app/main/main.controller.js

var main = angular.module('main.controller', []);

main.controller('main', 
	[
		'$scope',
		'mainService',
	function(
		$scope,
		mainService
	) {
		var socket = io();

		$scope.main = {};

		$scope.main.messagelist = [];

		$scope.main.sendchat = function(message) {
			if (message && message.length > 0) {
				// console.log(message);
				socket.emit('chat_message', {
					message: message,
					senderid: socket.id
				});

				$scope.main.chatmessage = '';
			}

		}

		socket.on('chat_message', function(msg){
			console.log('new message: ' + msg.message + ' ' + msg.senderid);

			msg.class = 'row chat-receive';

			if (msg.senderid == socket.id) {
				msg.class = 'row chat-send';
			}

			msg.timeString = moment.unix(msg.time/1000).format('MM/DD/YYYY hh:mm a');

			$scope.main.messagelist.push(msg);

			$scope.$apply();
		});


	}
]);
