"use strict";

var dashboardApp = angular.module("DashboardApp", []);

dashboardApp.controller("DashboardCtrl", ["$scope", "$http", "$cookies", function($scope, $http, $cookies) {
    $http.get("/api/getuserinfo/")
        .then(function(res) {
            $scope.firstname = res.data[0].firstname;
            $scope.lastname = res.data[0].lastname;
        });
}]);