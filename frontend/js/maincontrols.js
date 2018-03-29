var app = angular.module("PrayerSched", [
    "ngRoute",
    "ngCookies",
    "LoginApp",
    "RegisterApp",
    "DashboardApp",
    "AddRequestApp",
    "ViewRequestsApp",
    "AgendaApp",
    "CalendarApp"
]);

app.config(["$routeProvider", function($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "/templates/login.html",
            controller: "LoginCtrl"
        })
        .when("/register", {
            templateUrl: "/templates/register.html",
            controller: "RegisterCtrl"
        })
        .when("/dashboard", {
            templateUrl: "/templates/dashboard.html",
            controller: "DashboardCtrl"
        })
        .when("/addreq", {
            templateUrl: "/templates/addrequest.html",
            controller: "AddRequestCtrl"
        })
        .when("/viewreq", {
            templateUrl: "/templates/viewrequests.html",
            controller: "ViewRequestsCtrl"
        })
        .when("/agenda", {
            templateUrl: "/templates/agenda.html",
            controller: "AgendaCtrl"
        })
        .when("/calendar", {
            templateUrl: "/templates/calendar.html",
            controller: "CalendarCtrl"
        });
}]);