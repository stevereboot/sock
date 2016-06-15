// public/app/main/main.service.js

var mainSvc = angular.module('main.service', []);

mainSvc.service('mainService', ['$http', '$q',
	function($http, $q) {
		this.addEvent = function(input) {
			return $q(function(resolve, reject) {
				$http.post('/api/main/update', input).then(function(data) {
					resolve(data.data);
				});
			});
		}
		
	}
]);
