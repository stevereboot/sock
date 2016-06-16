// public/app/shared/auth.service.js

var auth = angular.module('authService', []);

auth.service('authService', 
	[
		'$http',
	function(
		$http
	) {
		this.user = function(callback) {
			$http.get('/api/auth/get').then(function(data) {
				callback(data.data);
			});
		}

		this.login = function(info, callback) {
			$http.post('/api/auth/login', info).then(function(data) {
				callback(data.data);
			});
		}		

		this.create = function(info, callback) {
			$http.post('/api/auth/create', info).then(function(data) {
				callback(data.data);
			});
		}

		this.logout = function(callback) {
			$http.get('/api/auth/logout').then(function(data) {
				callback(data.data);
			});
		}
	}
]);