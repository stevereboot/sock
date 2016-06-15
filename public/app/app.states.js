//public/app/app.states.js

var appStates = angular.module('appStates', []);

appStates.config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
	function($stateProvider, $urlRouterProvider, $locationProvider) {
		$stateProvider.
			state('main', {
				url: '/',
				templateUrl: 'app/main/main.html',
				controller: 'main'
			});

		$urlRouterProvider.otherwise(function($injector, $location) {
			var state = $injector.get('$state');
			state.go('main');
		});

		$locationProvider.html5Mode(true);
	}
]);
