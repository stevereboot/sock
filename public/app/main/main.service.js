// public/app/main/main.service.js

var mainSvc = angular.module('main.service', []);

mainSvc.service('mainService', ['$http', '$q',
	function($http, $q) {
		this.getEmojiList = function(input) {
			return $q(function(resolve, reject) {
				$http.get('/img/' + input.file).then(function(data) {
					resolve(data.data);
				});
			});
		}

	}
]);
