"use strict";

var dashboardApp = angular.module("DashboardApp", []);

dashboardApp.controller("DashboardCtrl", ["$scope", "$http", "$cookies", function($scope, $http, $cookies) {
    $http.get("/api/getuserinfo/")
        .then(function(res) {
            $scope.firstname = res.data[0].firstname;
            $scope.lastname = res.data[0].lastname;
        });

    var timeData = new Date();
    var currMonth = timeData.getMonth() + 1;
    if(currMonth === 1) {
        $scope.d_month = "January";
    } else if(currMonth === 2) {
        $scope.d_month = "February";
    } else if(currMonth === 3) {
        $scope.d_month = "March";
    } else if(currMonth === 4) {
        $scope.d_month = "April";
    } else if(currMonth === 5) {
        $scope.d_month = "May";
    } else if(currMonth === 6) {
        $scope.d_month = "June";
    } else if(currMonth === 7) {
        $scope.d_month = "July";
    } else if(currMonth === 8) {
        $scope.d_month = "August";
    } else if(currMonth === 9) {
        $scope.d_month = "September";
    } else if(currMonth === 10) {
        $scope.d_month = "October";
    } else if(currMonth === 11) {
        $scope.d_month = "November";
    } else {
        $scope.d_month = "December";
    }
    $scope.d_date = timeData.getDate();
    $scope.d_year = timeData.getFullYear();
}]);