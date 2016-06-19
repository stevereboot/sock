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
	function(
		$scope,
		$state,
		mainService,
		authService,
		toolsService,
		$compile
	) {

		$scope.main = {};
		$scope.main.messagelist = [];

		var socket = null;

		$scope.main.thisEmoji = 'People';

		// Check authentication
		authService.user(function(resp) {
			$scope.main.login = resp.username || false;

			if ($scope.main.login) {
				// do stuff if logged in
				getAvatar();
				$scope.main.getEmoji($scope.main.thisEmoji);

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

		function getAvatar() {
			mainService.getAvatar({
				username: $scope.main.login
			}).then(function(resp) {
				$scope.main.myAvatar = resp.avatar;
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

		$scope.main.toTrusted = function(html) {
			return toolsService.toTrusted(html);
		}

		$scope.main.getEmoji = function(category) {
			event.stopPropagation();
			mainService.getEmojiList({file: 'emoji.json'}).then(function(resp) {

				var emoji_lib = toolsService.groupBy(resp, 'category');

				emoji_lib[category].sort(function(a, b) { 
					return a.sort_order - b.sort_order;
				})

				var emoji_chunk = 8;
				var emoji_list = [];

				// var foo = emoji_lib[category].slice(0, 60);
				var foo = emoji_lib[category];

				for (var i = 0; i < foo.length; i += emoji_chunk) {
					var a = foo.slice(i, i + emoji_chunk);
					emoji_list.push(a);
				}

				$scope.main.emojiList = emoji_list;
				$scope.main.thisEmoji = category;
			});
		}


		$scope.main.emoji_img = function(emoji) {
			var size = 24;
			// return $scope.main.to_trusted('<img src="img/img_trans.gif" alt="' + emoji.short_name + '" style="width: '+size+'px; height: '+size+'px; background: url(img/sheet_apple_'+size+'.png) ' + emoji.sheet_x * -size + 'px ' + emoji.sheet_y * -size + 'px;">');
			return toolsService.toTrusted('<img src="img/emoji/' + emoji.image + '" alt="' + emoji.short_name + '" style="width: '+size+'px; height: '+size+'px;">');
		}

		$scope.main.select_emoji = function(emoji) {	
			addHtmlAtCaret($scope.main.emoji_img(emoji), 'chatInput');
		}

		function addHtmlAtCaret(html, id) {
			document.getElementById(id).focus();
			var sel, range;
			if (window.getSelection) {
				// IE9 and non-IE
				sel = window.getSelection();
				if (sel.getRangeAt && sel.rangeCount) {
					range = sel.getRangeAt(0);
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

					// Preserve the selection
					if (lastNode) {
						range = range.cloneRange();
						range.setStartAfter(lastNode);
						range.collapse(true);
						sel.removeAllRanges();
						sel.addRange(range);
					}

					$scope.main.chatmessage = document.getElementById(id).innerHTML;
					
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