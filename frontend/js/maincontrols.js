var app = angular.module("PrayerSched", [
    "ngRoute",
    "LoginApp",
    "RegisterApp"
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
        });
}]);