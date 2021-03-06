// public/app/main/main.controller.js

var main = angular.module('main.controller', []);

main.controller('main', 
	[
		'$scope',
		'$state',
		'mainService',
		'authService',
		'toolsService',
		'$compile',
		'$window',
	function(
		$scope,
		$state,
		mainService,
		authService,
		toolsService,
		$compile,
		$window
	) {

		$scope.main = {};
		$scope.main.messagelist = [];

		var socket = null;

		$scope.main.thisEmoji = 'people';
		$scope.main.thisEmojiIndex = 0;

		$scope.main.users = [];

		// Check authentication
		authService.user(function(resp) {
			$scope.main.login = resp.username || false;

			if ($scope.main.login) {
				// do stuff if logged in
				getAvatar($scope.main.login);

				prepEmoji();
				$scope.main.setEmoji($scope.main.thisEmoji, $scope.main.thisEmojiIndex);

				// Get previous message (count limit?)
				getPrevMessages();

				// Connect to socket if logged in
				socket = io();

				socket.on('connect', function() {
					// Send message to server with username
					socket.emit('user_joined', {
						senderid: socket.id,
						username: $scope.main.login
					});
				});

				// On new message
				socket.on('chat_message', function(msg) {
					getChat(msg);
					$scope.$apply();
				});

				// On new user joining
				socket.on('user_joined', function(msg) {
					newUser(msg);
				});	

				// On user leaving
				socket.on('user_left', function(msg) {
					byeUser(msg);
				});	

			} else {
				$state.go('login');
			}
		});

		function getAvatar(username) {
			mainService.getAvatar({
				username: username
			}).then(function(resp) {
				$scope.main.myAvatar = resp.avatar;
			});
		}

		function getUserAvatars(users) {
			mainService.getUserAvatars(users).then(function(resp) {
				for (i in users) {
					$scope.main.users[i].avatar = resp[i].avatar;
				}
			});
		}

		function getPrevMessages() {
			mainService.getPrevMessages().then(function(resp) {
				for (i in resp) {
					getChat(resp[i].msg);
				}
			});
		}

		$scope.main.sendchat = function(message) {
			if (message && message.length > 0) {
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

			// if (msg.senderid == socket.id) {
			if (msg.username == $scope.main.login) {
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

			// $scope.$apply();
		};

		function newUser(msg) {
			msg.class = 'row user-joined';
			msg.message = '<b>' + msg.username + '</b> has joined';

			$scope.main.users = [];
			for (i in msg.userList) {
				$scope.main.users.push({
					username: msg.userList[i]
				});
			}

			$scope.main.messagelist.push(msg);
			getUserAvatars($scope.main.users);

			$scope.$apply();

		};

		function byeUser(msg) {
			msg.class = 'row user-left';
			msg.message = '<b>' + msg.username + '</b> has left';

			$scope.main.users = [];
			for (i in msg.userList) {
				$scope.main.users.push({
					username: msg.userList[i]
				});
			}

			$scope.main.messagelist.push(msg);
			getUserAvatars($scope.main.users);

			$scope.$apply();

		};


		$scope.main.toTrusted = function(html) {
			return toolsService.toTrusted(html);
		}

		function prepEmoji() {
			mainService.getEmojiList({file: 'emoji_categorized.json'}).then(function(resp) {
				$scope.main.emojiList = resp;
				$scope.main.emojiCat = [
					{
						name: 'people',
						index: 0,
						label: 'Smileys and People'
					},
					{
						name: 'nature',
						index: 1,
						label: 'Animals and Nature'
					},
					{
						name: 'foods',
						index: 2,
						label: 'Food and Drink'
					},
					{
						name: 'activity',
						index: 3,
						label: 'Activity'
					},					
					{
						name: 'places',
						index: 4,
						label: 'Travel & Places'
					},
					{
						name: 'objects',
						index: 5,
						label: 'Objects'
					},				
					{
						name: 'symbols',
						index: 6,
						label: 'Symbols'
					},		
					{
						name: 'flags',
						index: 7,
						label: 'Flags'
					}
				]
			});
		}

		$scope.main.setEmoji = function(category, index) {
			$scope.main.thisEmoji = category;
			$scope.main.thisEmojiIndex = index;
		}

		$scope.main.emoji_img = function(emoji) {
			var size = 64;
			var scaled = 24;
			var ratio = scaled / size;

			return toolsService.toTrusted('<img class="emoji-img" src="img/emoji/img-apple-'+size+'/'+emoji.image+'" alt="' + emoji.short_name + '">');
			// return toolsService.toTrusted('<img src="img/emoji/img-apple-'+size+'/'+emoji.image+'" alt="' + emoji.short_name + '" style="width: '+scaled+'px; height: '+scaled+'px;">');
			// return toolsService.toTrusted('<img src="img/img_trans.gif" alt="' + emoji.short_name + '" style="width: '+size+'px; height: '+size+'px; background: url(img/emoji/sheet_apple_'+size+'.png) ' + emoji.sheet_x * -size + 'px ' + emoji.sheet_y * -size + 'px; zoom: '+ratio+'; -moz-transform:scale('+ratio+'); -moz-transform-origin: 0 0;">');
			// return toolsService.toTrusted('<img src="img/img_trans.gif" alt="' + emoji.short_name + '" style="width: '+size+'px; height: '+size+'px; background: url(img/emoji/sheet_apple_'+size+'_indexed_256.png) ' + emoji.sheet_x * -size + 'px ' + emoji.sheet_y * -size + 'px; zoom: '+ratio+'; -moz-transform:scale('+ratio+'); -moz-transform-origin: 0 0;">');
		}

		$scope.main.emoji_sprite = function(emoji) {
			var size;
			var screenWidth = $window.innerWidth;
			if (screenWidth < 768) {
				size = 20
			} else if (screenWidth >= 768) {
				size = 24
			}

			return toolsService.toTrusted('<img src="img/img_trans.gif" alt="' + emoji.short_name + '" style="width: '+size+'px; height: '+size+'px; background: url(img/emoji/sheet_apple_'+size+'_indexed_256.png) ' + emoji.sheet_x * -size + 'px ' + emoji.sheet_y * -size + 'px;">');
		}

		$scope.main.select_emoji = function(emoji) {	
			addHtmlAtCaret($scope.main.emoji_img(emoji), 'chatInput');
		}

		function addHtmlAtCaret(html, id) {
			document.getElementById(id).focus();

			if (window.getSelection) {
				// IE9 and non-IE
				var sel = window.getSelection();
				if (sel.getRangeAt && sel.rangeCount) {
					var range = sel.getRangeAt(0);
					range.deleteContents();

					// Range.createContextualFragment() would be useful here but is
					// non-standard and not supported in all browsers (IE9, for one)
					var el = document.createElement("div");
					el.innerHTML = html;
					$compile(el)($scope);

					var frag = document.createDocumentFragment(), node, lastNode;
					while ( (node = el.firstChild) ) {
						lastNode = frag.appendChild(node);
					}
					range.insertNode(frag);

					// Restore the selection
					if (lastNode) {
						range = range.cloneRange();
						range.setStartAfter(lastNode);
						range.collapse(true);
						sel.removeAllRanges();
						sel.addRange(range);
					}

					// Do not bind in this function, will destroy selection- do it right before submit
				}
			} else if (document.selection && document.selection.type != "Control") {
				// IE < 9
				document.selection.createRange().pasteHTML(html);
			}
		}

	}
]).directive('contenteditable', function() {
	return {
		require: 'ngModel',
		link: function(scope, element, attrs, ngModel) {

			function read() {
				ngModel.$setViewValue(element.html());
			}

			ngModel.$render = function() {
				element.html(ngModel.$viewValue || "");
			};

			element.bind('blur keyup change', function() {
				scope.$apply(read);
			});

			element.on('keydown', function(e) {
				if (e.keyCode == 13) {
					if (ngModel.$viewValue && ngModel.$viewValue.length > 0) {
						scope.main.chatmessage = document.getElementById('chatInput').innerHTML;
						element.submit();
					}
					return false;
				}
			});
		}
	}
}).directive("scrollBottom", ['$timeout', function($timeout) {
	return {
		scope: {
			scrollBottom: "="
		},
		link: function (scope, element) {
			scope.$watchCollection('scrollBottom', function (newValue) {
				if (newValue) {
					$timeout(function() {
						$(element).scrollTop($(element)[0].scrollHeight);
					});
				}
			});
		}
	}
}]);