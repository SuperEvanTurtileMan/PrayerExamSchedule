"use strict";

var registerApp = angular.module("RegisterApp", []);

registerApp.controller("RegisterCtrl", ["$rootScope", "$scope", "$http", function($rootScope, $scope, $http) {
    $scope.register = function() {
        var reg_info = {};

        reg_info.username = $scope.r_username;
        reg_info.password = $scope.r_password;
        reg_info.firstname = $scope.firstname;
        reg_info.lastname = $scope.lastname;

        // We want to validate the form of the email
        var atpos = $scope.r_username.indexOf("@");
        var dotpos = $scope.r_username.indexOf(".");
        if(atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= $scope.r_username.length) {
            $scope.error = "Error: your username must be an email address.";
        } else {
            if(reg_info.password.length <= 7) {
                $scope.error = "Error: your password must be at least 8 characters long.";
            } else {
                // Check if password contains each of the following characters
                if(! /^[0-9a-zA-Z]+$/.test($scope.r_password)) {
                    $scope.error = "Error: your password must contain at least one numerical value, one lowercase letter, and one uppercase letter.";
                } else {
                    if($scope.lastname.length > 1 || $scope.lastname.length < 1) {
                        $scope.error = "Error: please input only your last name initial.";
                    } else {
                        $http.post("/api/register/", reg_info)
                            .then(function(res) {
                                if(res.data.validRegistration) {
                                    //console.log("This is a new user! welcome!");
                                    $rootScope.loggedIn = true;
                                    window.location.replace("#!/dashboard");
                                } else {
                                    $scope.error = "There is an existing user in the database!";
                                }
                                // Give the new user a session id
                                // Send the user to the landing page
                        });
                    }
                }
            }
        } 

        /*if(reg_info.username.length !== 0) {
            if(reg_info.password.length > 7) {
                if(reg_info.lastname.length === 1) {
                    $http.post("/api/register/", reg_info)
                        .then(function(res) {
                        // Give the new user a session id
                        // Send the user to the landing page
                        $scope.loggedIn = true;
                    }); 
                } else {
                    $scope.error = "Error: your last name must be an initial, without including the period \".\"";
                }
            } else {
                $scope.error = "Error: your password must be more than seven characters, utilizing at least one "
                    + "symbol, one number, and a mix of lowercase and uppercase characters.";
            }
        } else {
            $scope.error = "Error: your username must be an email address.";
        }*/
    };
}]);