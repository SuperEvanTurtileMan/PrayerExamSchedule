"use strict";

var agendaApp = angular.module("AgendaApp", []);

agendaApp.controller("AgendaCtrl", ["$scope", "$http", "$cookies", function($scope, $http, $cookies) {
    // Grab today's date and current month
    var timeData = new Date();
    var date = timeData.getDate();
    var month = timeData.getMonth() + 1;
    var year = timeData.getFullYear();
    var currentDay = {};

    $scope.a_month = month;
    $scope.a_date = date;
    $scope.a_year = year;
    currentDay.month = month;
    currentDay.date = date;
    currentDay.year = year;

    $http.post("/api/getglobalreq/", currentDay)
        .then(function(res) {
            $scope.prayerRequests = res.data;
        });
}]);