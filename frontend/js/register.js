"use strict";

var registerApp = angular.module("RegisterApp", []);

registerApp.controller("RegisterCtrl", ["$scope", "$http", function($scope, $http) {
    $scope.register = function() {
        var reg_info = {};

        reg_info.username = $scope.r_username;
        reg_info.password = $scope.r_password;
        reg_info.firstname = $scope.firstname;
        reg_info.lastname = $scope.lastname;

        $http.post("/api/register/", reg_info)
            .then(function(res) {
                // Give the new user a session id
                // Send the user to the landing page
                console.log("REGISTERED!");
            }); 
    };
}]);