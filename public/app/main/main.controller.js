// public/app/main/main.controller.js

var main = angular.module('main.controller', []);

main.controller('main', 
	[
		'$scope',
		'$state',
		'mainService',
		'authService',
	function(
		$scope,
		$state,
		mainService,
		authService
	) {

		$scope.main = {};
		$scope.main.messagelist = [];

		var socket = null;

		// Check authentication
		authService.user(function(resp) {
			$scope.main.login = resp.username || false;

			if ($scope.main.login) {
				// do stuff if logged in
				// getChildren();

				// Connect to socket if logged in
				socket = io();

				// On new message
				socket.on('chat_message', function(msg) {
					getChat(msg);
				});
			} else {
				$state.go('login');
			}
		});

		$scope.main.sendchat = function(message) {
			if (message && message.length > 0) {
				// console.log(message);
				socket.emit('chat_message', {
					message: message,
					senderid: socket.id,
					username: $scope.main.login
				});

				$scope.main.chatmessage = '';
			}

		}

		function getChat(msg) {
			msg.class = 'row chat-receive';

			if (msg.senderid == socket.id) {
				msg.class = 'row chat-send';
			}

			var msgTime = moment.unix(msg.time/1000);
			var now = moment();

			if (now.isSame(msgTime, 'd')) {
				msg.timeString = msgTime.format('h:mm a');
			} else if (now.isSame(msgTime, 'y')) {
				msg.timeString = msgTime.format('MM/DD h:mm a');
			} else {
				msg.timeString = msgTime.format('MM/DD/YYYY h:mm a');
			}

			$scope.main.messagelist.push(msg);

			$scope.$apply();
		};

		$scope.main.embedOptions = {
			image: {
				embed: false
			},
			code: {
				highlight  : false
			},
			tweetEmbed: false
		}


	}
]);
