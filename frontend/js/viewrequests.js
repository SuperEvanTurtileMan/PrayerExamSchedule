"use strict";

var viewRequestApp = angular.module("ViewRequestsApp", []);

viewRequestApp.controller("ViewRequestsCtrl", ["$scope", "$http", "$cookies", function($scope, $http, $cookies) {
    $http.get("/api/getfirstname/")
        .then(function(res) {
            $scope.firstname = res.data;
        });

    $http.get("/api/getrequests/")
        .then(function(res) {
            $scope.prayerRequests = res.data;
        });

    $scope.deleteRequest = function(requestName, hour, minute) {
        var data = {};

        data.requestName = requestName;
        data.hour = hour;
        data.minute = minute;

        $http.post("/api/deletereq", data)
            .then(function(res) {
                $http.get("/api/getrequests/")
                    .then(function(res) {
                        $scope.prayerRequests = res.data;
                    });
            });
    }
}]);