// public/app/main/main.service.js

var mainSvc = angular.module('main.service', []);

mainSvc.service('mainService', ['$http', '$q',
	function($http, $q) {
		this.getEmojiList = function(input) {
			return $q(function(resolve, reject) {
				$http.get('/img/emoji/' + input.file).then(function(data) {
					resolve(data.data);
				});
			});
		}

		this.getAvatar = function(input) {
			return $q(function(resolve, reject) {
				$http.get('/api/main/getavatar' + input.username).then(function(data) {
					resolve(data.data);
				});
			});
		}

		this.getUserAvatars = function(input) {
			getAvatars = [];

			angular.forEach(input, function(u) {
				getAvatars.push($http.get('/api/main/getavatar' + u.username).then(function(data) {
					return data.data;
				}));
			});

			return $q.all(getAvatars);
		}

		this.getPrevMessages = function(input) {
			return $q(function(resolve, reject) {
				$http.get('/api/main/getmessages').then(function(data) {
					resolve(data.data);
				});
			});
		}

	}
]);
