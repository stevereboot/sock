// public/app/app.module.js

var thirdPartyApps = [
    'ui.router'
]

var sharedApps = [
]

var componentApps = [
    'appStates',
    'main.controller',
    'main.service'
]

// Define App Module
var app = angular.module('appModule', [].concat(thirdPartyApps, sharedApps, componentApps));

// Run on app startup
// app.run([function() {

// }]);
