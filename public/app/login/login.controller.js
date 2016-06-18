// public/app/nav/login.controller.js

var login = angular.module('login.controller', []);

login.controller('login', 
    [
        '$scope',
        '$http',
        '$state',
        'loginService',
        'authService',
        'toolsService',
    function(
        $scope,
        $http,
        $state,
        loginService,
        authService,
        toolsService
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
            $scope.login.registerForm.avatar = $scope.login.selected_avatar || 'user.png';
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

        loginService.getAvatarList({file: 'avatar.json'}).then(function(resp) {

            var avatar_lib = toolsService.groupBy(resp, 'category');

            var category = 'animal';

            avatar_lib[category].sort(function(a, b) { 
                return a.sort_order - b.sort_order;
            })

            var chunk = 6;
            var list = [];

            var foo = avatar_lib[category].slice(0, 30);

            for (var i = 0; i < foo.length; i += chunk) {
                var a = foo.slice(i, i + chunk);
                list.push(a);
            }

            $scope.login.avatarList = list;
        });

        $scope.login.avatar_img = function(avatar) {
            var size = 35;
            return toolsService.toTrusted('<img src="img/avatar/' + avatar.category + '/' + avatar.image + '" alt="' + avatar.short_name + '" style="width: '+size+'px; height: '+size+'px;">');
        }

        $scope.login.select_avatar = function(avatar) {    
            $scope.login.selected_avatar = avatar.category + '/' + avatar.image;
            $scope.login.selected_avatar_img = $scope.login.avatar_img(avatar);
        }        


    }
]);