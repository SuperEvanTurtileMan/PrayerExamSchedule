"use strict";

var addReqApp = angular.module("AddRequestApp", []);

addReqApp.controller("AddRequestCtrl", ["$scope", "$http", "$cookies", function($scope, $http, $cookies) {
    $scope.submitInfo = function() {
        var prayerReqData = {};

        $http.get("/api/getuserinfo")
            .then(function(res) {
                // Grab all other information for creating prayer request
                prayerReqData = addInPrayerReqInformation(res.data[0].username, prayerReqData);
            });
    };

    var addInPrayerReqInformation = function(username, prayerReqData) {
        prayerReqData.username = username;
        prayerReqData.prayerRequest = $scope.prayerReq;
        prayerReqData.hour = parseInt($scope.hour);
        prayerReqData.minute = parseInt($scope.minute);
        prayerReqData.timePeriod = $scope.timePeriod;
        prayerReqData.year = 2018;
        prayerReqData.month = parseInt($scope.month);
        prayerReqData.date = parseInt($scope.date);

        if($scope.prayerReq.length > 0) {
            if(prayerReqData.hour && prayerReqData.hour < 13 && prayerReqData.hour > 0) {
                if(prayerReqData.minute && prayerReqData.minute < 60 && prayerReqData.minute >= 0) {
                    if(prayerReqData.timePeriod === "PM" || prayerReqData.timePeriod === "AM") {
                        if(prayerReqData.month && prayerReqData.month < 13 && prayerReqData.month > 0) {
                            if(prayerReqData.month === 1 ||
                              prayerReqData.month === 3 ||
                              prayerReqData.month === 5 ||
                              prayerReqData.month === 7 ||
                              prayerReqData.month === 8 ||
                              prayerReqData.month === 10 ||
                              prayerReqData.month === 12) {
                                if(!prayerReqData || (prayerReqData && (prayerReqData.date > 31 || prayerReqData.date < 1))) {
                                    $scope.error = "Error: You must input a date value between 1 to 31 for the corresponding month.";
                                } else {
                                    console.log(prayerReqData);
                                    $http.post("/api/addrequest", prayerReqData)
                                        .then(function(res) {
                                            $scope.res = "Successfully posted your prayer request! You may check it out under the 'View Your Prayer Requests' section.";
                                            $scope.prayerReq = "";
                                            $scope.hour = "";
                                            $scope.minute = "";
                                            $scope.timePeriod = "";
                                            $scope.month = "";
                                            $scope.date = "";
                                            $scope.error = "";
                                        });
                                }
                            } else if(prayerReqData.month === 4 ||
                              prayerReqData.month === 6 ||
                              prayerReqData.month === 9 ||
                              prayerReqData.month === 11) {
                                if(!prayerReqData || (prayerReqData && (prayerReqData.date > 30 || prayerReqData.date < 1))) {
                                    $scope.error = "Error: You must input a date value between 1 to 30 for the corresponding month.";
                                } else {
                                    console.log(prayerReqData);
                                    $http.post("/api/addrequest", prayerReqData)
                                        .then(function(res) {
                                            $scope.res = "Successfully posted your prayer request! You may check it out under the 'View Your Prayer Requests' section.";
                                            $scope.prayerReq = "";
                                            $scope.hour = "";
                                            $scope.minute = "";
                                            $scope.timePeriod = "";
                                            $scope.month = "";
                                            $scope.date = "";
                                            $scope.error = "";
                                        });
                                }
                            } else { // In the case when prayerReqData.month === 2
                                if(prayerReqData.year % 4 === 0) {
                                    if(!prayerReqData || (prayerReqData && (prayerReqData.date > 29 || prayerReqData.date < 1))) {
                                        $scope.error = "Error: You must input a date value between 1 to 29, where the 29th represents Leap Day in February.";
                                    } else {
                                        console.log(prayerReqData);
                                        $http.post("/api/addrequest", prayerReqData)
                                            .then(function(res) {
                                                $scope.res = "Successfully posted your prayer request! You may check it out under the 'View Your Prayer Requests' section.";
                                                $scope.prayerReq = "";
                                                $scope.hour = "";
                                                $scope.minute = "";
                                                $scope.timePeriod = "";
                                                $scope.month = "";
                                                $scope.date = "";
                                                $scope.error = "";
                                            });
                                    }
                                } else {
                                    if(!prayerReqData || (prayerReqData && (prayerReqData.date > 28 || prayerReqData.date < 1))) {
                                        $scope.error = "Error: You must input a date value between 1 to 28. Since this is not a leap year, you cannot input a date of 29th February.";
                                    } else {
                                        console.log(prayerReqData);
                                        $http.post("/api/addrequest", prayerReqData)
                                            .then(function(res) {
                                                $scope.res = "Successfully posted your prayer request! You may check it out under the 'View Your Prayer Requests' section.";
                                                $scope.prayerReq = "";
                                                $scope.hour = "";
                                                $scope.minute = "";
                                                $scope.timePeriod = "";
                                                $scope.month = "";
                                                $scope.date = "";
                                                $scope.error = "";
                                            });
                                    }
                                }
                            }
                        } else {
                            $scope.error = "Error: You must input a month value between 1 (representing January) to 12 (representing December).";
                        }
                    } else {
                        $scope.error = "Error: Please enter in AM or PM (these must be upper case!) in the time period input field.";
                    }
                } else {
                    $scope.error = "Error: You must input a minute value between 0 to 59.";
                }
            } else {
                $scope.error = "Error: You must input an hour value between 1 to 12.";
            }
        } else {
            $scope.error = "Error: Enter in your prayer request.";
        }
    };
}]);