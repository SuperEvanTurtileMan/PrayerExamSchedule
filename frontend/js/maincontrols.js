var app = angular.module("PrayerSched", [
    "ngRoute"
]);

app.config(function($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "templates/login.html"
            // controller: "loginCtrl"
        })
        .when("/register", {
            templateUrl: "templates/register.html"
            // controller: "registerCtrl"
        })
});