// public/app/login/login.service.js

var loginSvc = angular.module('login.service', []);

loginSvc.service('loginService', ['$http', '$q',
	function($http, $q) {
		this.getAvatarList = function(input) {
			return $q(function(resolve, reject) {
				$http.get('/img/avatar/' + input.file).then(function(data) {
					resolve(data.data);
				});
			});
		}

	}
]);
