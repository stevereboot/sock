// public/app/nav/login.controller.js

var login = angular.module('login.controller', []);

login.controller('login', 
    [
        '$scope',
        '$http',
        '$state',
        'authService',
    function(
        $scope,
        $http,
        $state,
        authService
    ) {
        $scope.login = {}

        // Toggles the registration form
        $scope.login.registration = false;
        $scope.login.toggleRegistration = function() {
            $scope.login.registration = !$scope.login.registration;
        }

        $scope.login.login = function() {      
            // Simple validation
            if (!$scope.login.loginForm) return;

            if (!$scope.login.loginForm.password ||
                $scope.login.loginForm.password.length < 1) return;

            authService.login($scope.login.loginForm, function(resp) {
                if (resp) {
                    console.log(resp + ' has been logged in');
                    $state.go('main');
                } else {
                    console.log('Invalid username or password');
                    $scope.login.message = 'Invalid username or password';
                }
            });    
        }

        $scope.login.create = function() {
            // Simple validation
            if (!$scope.login.registerForm) return;

            if (!$scope.login.registerForm.password ||
                $scope.login.registerForm.password.length < 1) return;

            if ($scope.login.registerForm.password != 
                    $scope.login.registerForm.passwordConfirm) {
                console.log('Passwords do not match');
                return;
            }

            $scope.login.registerForm.admin = false;
            $scope.login.registerForm.avatar = 'grey-circle.png';
            $scope.login.registerForm.loginAfter = true;

            authService.create($scope.login.registerForm, function(resp) {
                if (resp) {
                    if (resp.error) {
                        console.log(resp.error.message);
                    } else {
                        console.log(resp + ' has been registered');
                    	$state.go('main');
                    }
                }
            });
        }


    }
]);