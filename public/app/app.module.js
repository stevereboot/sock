// public/app/app.module.js

var thirdPartyApps = [
    'ui.router',
    'luegg.directives'
]

var sharedApps = [
	'authService'
]

var componentApps = [
    'appStates',
    'login.controller',
    'main.controller',
    'main.service'
]

// Define App Module
var app = angular.module('appModule', [].concat(thirdPartyApps, sharedApps, componentApps));

// Run on app startup
// app.run([function() {

// }]);
