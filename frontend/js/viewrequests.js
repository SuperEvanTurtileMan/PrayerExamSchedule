"use strict";

var viewRequestApp = angular.module("ViewRequestsApp", []);

viewRequestApp.controller("ViewRequestsCtrl", ["$scope", "$http", "$cookies", function($scope, $http, $cookies) {
    $http.get("/api/getrequests/")
        .then(function(res) {
            $scope.prayerRequests = res.data;
        });
}]);