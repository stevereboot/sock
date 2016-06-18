// public/app/app.module.js

var thirdPartyApps = [
    'ui.router'
]

var sharedApps = [
	'authService',
	'toolsService'
]

var componentApps = [
    'appStates',
    'login.controller',
    'login.service',
    'main.controller',
    'main.service'
]

// Define App Module
var app = angular.module('appModule', [].concat(thirdPartyApps, sharedApps, componentApps));

// Run on app startup
// app.run([function() {

// }]);
