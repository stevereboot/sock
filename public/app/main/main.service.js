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

	}
]);
