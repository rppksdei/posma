//angular.module('MyAppService', ['ngResource']);
var myapp = angular.module("posma", ['ngRoute', 'PosmaService']);
function checkloggedIn($rootScope, $http, $location) {
    $http.get('/login/checkloggedin').success(function(data) {
        if (data.error) {
            $location.path('/');
        }
        else{
            $rootScope.user = data;
        }
    });  
}
myapp.config(['$routeProvider',
    function ($routeProvider){
        $routeProvider
            .when ('/', {
                templateUrl:'/html/authenticate/login.html',
                controller:'loginCtrl',
            })
            .when('/dashboard',{
                templateUrl:'/html/dashboard/dashboard.html',
                controller:'dashboardCtrl',
                resolve:{'logged_in':checkloggedIn}
            })
            .when('/edit_profile',{
                templateUrl:'/html/profile/edit_profile.html',
                controller:'profileCtrl',
                flag:'edit_profile',
                resolve:{'logged_in':checkloggedIn}
            })
            .when('/change_password',{
                templateUrl:'/html/profile/change_password.html',
                controller:'profileCtrl',
                flag:'change_password',
                resolve:{'logged_in':checkloggedIn}
            })
            .when('/logout',{
                templateUrl:'/html/authenticate/login.html',
                controller:'loginCtrl',
                logout : true,
            })
            .otherwise({
                templateUrl:'/html/login.html',
                controller:'loginCtrl',
            });    
    }          
]);


