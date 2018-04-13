"use strict";

var calendarApp = angular.module("CalendarApp", []);

calendarApp.controller("CalendarCtrl", ["$scope", "$http", "$cookies", function($scope, $http, $cookies) {
    $http.get("/api/getcalendar/")
        .then(function(res) {
            var timeData = new Date();
            var currMonth = timeData.getMonth() + 1;
	    $scope.currDate = timeData.getDate();

            var daysInMonth = [];
            for(var i = 0; i < res.data.length; i++) {
                if(res.data[i].month === currMonth) {
                    daysInMonth.push(res.data[i]);
                }
            }

            if(currMonth === 1) {
                 $scope.c_month = "January";
            } else if(currMonth === 2) {
                 $scope.c_month = "February";
            } else if(currMonth === 3) {
                 $scope.c_month = "March";
            } else if(currMonth === 4) {
                 $scope.c_month = "April";
            } else if(currMonth === 5) {
                 $scope.c_month = "May";
            } else if(currMonth === 6) {
                 $scope.c_month = "June";
            } else if(currMonth === 7) {
                 $scope.c_month = "July";
            } else if(currMonth === 8) {
                 $scope.c_month = "August";
            } else if(currMonth === 9) {
                 $scope.c_month = "September";
            } else if(currMonth === 10) {
                 $scope.c_month = "October";
            } else if(currMonth === 11) {
                 $scope.c_month = "November";
            } else {
                 $scope.c_month = "December";
            }
            $scope.c_year = daysInMonth[0].year;

            $scope.fullCurrCalendar = createCalendar(daysInMonth);

            /* Grab all prayer requests for this current month */
            $http.post("/api/getCurrMonthReq/", {month: currMonth})
                .then(function(res) {
                    $scope.currMonthRequests = [];
                    for(var i = 0; i < res.data.length; i++) {
                        if(res.data[i].month === currMonth) {
                            $scope.currMonthRequests.push(res.data[i]);
                        }
                    }
                });
        });

    var createCalendar = function(monthData) {
        var calFormat = [];
        var weekFormat = [];
        var dayOfWeek = 0; // This index value represents "Sunday" whereas the index value 6 represents "Saturday"
        var week = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        var currDate = 0; // This is the first day in the month
        var weekVal = 1;

        while(weekVal <= 5) {
            // Reset everything back while adding new week to calFormat array
            if(dayOfWeek > 6) {
                calFormat.push(weekFormat); // Add newly created week into calFormat array
                weekFormat = [];  // Reset weekFormat array to empty array
                dayOfWeek = 0; // Reset back to index value of 0 - represents "Sunday"
                weekVal++;
            }

            // The following happens when it's a "Sunday" at the beginning of the month.
            if(currDate < monthData.length) {
                if(monthData[currDate].day === week[dayOfWeek]) {
                    weekFormat.push(monthData[currDate]);
                    currDate++;
                    dayOfWeek++;
                } else {
                    var blockDay = {month: monthData[0].month, date: "block", year: monthData[0].year, day: week[dayOfWeek]};
                    weekFormat.push(blockDay);
                    dayOfWeek++;
                }
            } else {
                var blockDay = {month: monthData[0].month, date: "block", year: monthData[0].year, day: week[dayOfWeek]};
                weekFormat.push(blockDay);
                dayOfWeek++;
            }
        }

        return calFormat;
    };
}]);