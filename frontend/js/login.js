"use strict";

var loginApp = angular.module("LoginApp", []);

loginApp.controller("LoginCtrl", ["$rootScope", "$scope", "$http", function($rootScope, $scope, $http) {
    $scope.login = function() {
        var loginCred = {};

        loginCred.username = $scope.username;
        loginCred.password = $scope.password;

        // Check if the username is a legitmate email address
        var atpos = $scope.username.indexOf("@");
        var dotpos = $scope.username.indexOf(".");
        if(atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= $scope.username.length) {
            $scope.error = "Error: your username must be an email address.";
        } else {
            if(loginCred.password.length <= 7) {
                $scope.error = "Error: your password must be at least 8 characters long.";
            } else {
                // Attempt login
                $http.post("/api/login/", loginCred)
                    .then(function(res) {
                        if(res.data.noFoundUser) {
                            $scope.error = "There is no such user on the database. Please enter in your correct credentials or create a new account.";
                        } else {
                            if(res.data.validLogin) {
                                //console.log("Welcome back!");
                                $rootScope.loggedIn = true;
                                window.location.replace("#!/dashboard");
                            } else {
                                $scope.error = "You entered in the wrong credentials. Please try again.";
                            }
                        }
                    });
            }
        }
    };
}]);