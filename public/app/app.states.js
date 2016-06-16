//public/app/app.states.js

var appStates = angular.module('appStates', []);

appStates.config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
	function($stateProvider, $urlRouterProvider, $locationProvider) {
		$stateProvider.
			state('main', {
				url: '/',
				templateUrl: 'app/main/main.html',
				controller: 'main'
			}).
			state('login', {
				url: '/login',
				templateUrl: 'app/login/login.html',
				controller: 'login'
			});			

		$urlRouterProvider.otherwise(function($injector, $location) {
			var state = $injector.get('$state');
			state.go('login');
		});

		$locationProvider.html5Mode(true);
	}
]);
