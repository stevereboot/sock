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
			console.log(message)
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

			console.log(msg)

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

		var all_emoji = [':bowtie:', ':smile:', ':laughing:', ':blush:', ':smiley:', ':relaxed:', ':smirk:', ':heart_eyes:', ':kissing_heart:', ':kissing_closed_eyes:', ':flushed:', ':relieved:', ':satisfied:', ':grin:', ':wink:', ':stuck_out_tongue_winking_eye:', ':stuck_out_tongue_closed_eyes:', ':grinning:', ':kissing:', ':kissing_smiling_eyes:', ':stuck_out_tongue:', ':sleeping:', ':worried:', ':frowning:', ':anguished:', ':open_mouth:', ':grimacing:', ':confused:', ':hushed:', ':expressionless:', ':unamused:', ':sweat_smile:', ':sweat:', ':disappointed_relieved:', ':weary:', ':pensive:', ':disappointed:', ':confounded:', ':fearful:', ':cold_sweat:', ':persevere:', ':cry:', ':sob:', ':joy:', ':astonished:', ':scream:', ':neckbeard:', ':tired_face:', ':angry:', ':rage:', ':triumph:', ':sleepy:', ':yum:', ':mask:', ':sunglasses:', ':dizzy_face:', ':imp:', ':smiling_imp:', ':neutral_face:', ':no_mouth:', ':innocent:', ':alien:', ':yellow_heart:', ':blue_heart:', ':purple_heart:', ':heart:', ':green_heart:', ':broken_heart:', ':heartbeat:', ':heartpulse:', ':two_hearts:', ':revolving_hearts:', ':cupid:', ':sparkling_heart:', ':sparkles:', ':star:', ':star2:', ':dizzy:', ':boom:', ':collision:', ':anger:', ':exclamation:', ':question:', ':grey_exclamation:', ':grey_question:', ':zzz:', ':dash:', ':sweat_drops:', ':notes:', ':musical_note:', ':fire:', ':hankey:', ':poop:', ':shit:', ':+1:', ':thumbsup:', ':-1:', ':thumbsdown:', ':ok_hand:', ':punch:', ':facepunch:', ':fist:', ':v:', ':wave:', ':hand:', ':raised_hand:', ':open_hands:', ':point_up:', ':point_down:', ':point_left:', ':point_right:', ':raised_hands:', ':pray:', ':point_up_2:', ':clap:', ':muscle:', ':metal:', ':fu:', ':runner:', ':running:', ':couple:', ':family:', ':two_men_holding_hands:', ':two_women_holding_hands:', ':dancer:', ':dancers:', ':ok_woman:', ':no_good:', ':information_desk_person:', ':raising_hand:', ':bride_with_veil:', ':person_with_pouting_face:', ':person_frowning:', ':bow:', ':couplekiss:', ':couple_with_heart:', ':massage:', ':haircut:', ':nail_care:', ':boy:', ':girl:', ':woman:', ':man:', ':baby:', ':older_woman:', ':older_man:', ':person_with_blond_hair:', ':man_with_gua_pi_mao:', ':man_with_turban:', ':construction_worker:', ':cop:', ':angel:', ':princess:', ':smiley_cat:', ':smile_cat:', ':heart_eyes_cat:', ':kissing_cat:', ':smirk_cat:', ':scream_cat:', ':crying_cat_face:', ':joy_cat:', ':pouting_cat:', ':japanese_ogre:', ':japanese_goblin:', ':see_no_evil:', ':hear_no_evil:', ':speak_no_evil:', ':guardsman:', ':skull:', ':feet:', ':lips:', ':kiss:', ':droplet:', ':ear:', ':eyes:', ':nose:', ':tongue:', ':love_letter:', ':bust_in_silhouette:', ':busts_in_silhouette:', ':speech_balloon:', ':thought_balloon:', ':feelsgood:', ':finnadie:', ':goberserk:', ':godmode:', ':hurtrealbad:', ':rage1:', ':rage2:', ':rage3:', ':rage4:', ':suspect:', ':trollface:'];
		
		var emoji_chunk = 6;
		var emoji_list = [];

		for (var i=0; i<all_emoji.length; i+=emoji_chunk) {
			var a = all_emoji.slice(i,i+emoji_chunk);
			emoji_list.push(a);
		}

		$scope.main.emojiList = emoji_list;

		$scope.main.select_emoji = function(emoji) {	
			console.log(emoji);
			// remove the colons

			// lookup image code


			if ($scope.main.chatmessage) {
				$scope.main.chatmessage = $scope.main.chatmessage + '<img src="img/img-apple-64/1f344.png" height="25" width="25" alt="'+emoji+'">';



			} else {
				$scope.main.chatmessage = '<img src="img/img-apple-64/1f344.png">';
				// $scope.main.chatmessage = '<img src="//i.stack.imgur.com/IjpTt.png">';
				// $scope.main.chatmessage = '<i class="emoticon emoticon-smile" title=":smile:"></i>';
			}
			
		}



	}
]).directive("contenteditable", function() {
  return {
    require: "ngModel",
    link: function(scope, element, attrs, ngModel) {

      function read() {
        ngModel.$setViewValue(element.html());
      }

      ngModel.$render = function() {
        element.html(ngModel.$viewValue || "");
      };

      element.bind("blur keyup change", function() {
        scope.$apply(read);
      });
    }
  };
});