"use strict";

var loginApp = angular.module("LoginApp", []);

loginApp.controller("LoginCtrl", ["$scope", "$http", function($scope, $http) {
    $scope.login = function() {
        var loginCred = {};

        loginCred.username = $scope.username;
        loginCred.password = $scope.password;
        $http.post("/api/login", loginCred)
            .then(function(res) {
                if(res.data.validLogin) {
                    // Get session id for login
                    // Go to landing page
                    console.log("LOGGED IN!");
                } else {
                    console.log("Wrong credentials");
                }
            });
    };
}]);