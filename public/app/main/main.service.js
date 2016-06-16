// public/app/main/main.service.js

var mainSvc = angular.module('main.service', []);

mainSvc.service('mainService', ['$http', '$q',
	function($http, $q) {
		this.getAvatar = function(input) {
			return $q(function(resolve, reject) {
				$http.get('/api/main/getavatar' + '/' + input.username).then(function(data) {
					resolve(data.data);
				});
			});
		}

	}
]);
