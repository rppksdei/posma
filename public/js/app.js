//angular.module('MyAppService', ['ngResource']);
var myapp = angular.module("posma", ['ngRoute',"ngTable", 'flash', 'PosmaService', 'ngCookies']);
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
            .when('/add_admin',{
                templateUrl:'/html/admin/add.html',
                controller:'adminCtrl',
                flag:'add_admin',
                resolve:{'logged_in':checkloggedIn}
            })
            .when('/listadmin',{
                templateUrl:'/html/admin/list.html',
                controller:'adminCtrl',
                flag:'list',
                resolve:{'logged_in':checkloggedIn}
            })
            .when('/logout',{
                templateUrl:'/html/authenticate/login.html',
                controller:'loginCtrl',
                logout : true,
            })
            .when('/questions',{
                templateUrl:'/html/questions/index.html',
                controller:'questionsCtrl',
                flag:'list',
                resolve:{'logged_in':checkloggedIn}
            })
            .when('/questions/add',{
                templateUrl:'/html/questions/add.html',
                controller:'questionsCtrl',
                flag:'add',
                resolve:{'logged_in':checkloggedIn}
            })
            .when('/surgeries',{
                templateUrl:'/html/surgery/surgeries.html',
                controller:'surgeryCtrl',
                flag:'get_surgery',
                resolve:{'logged_in':checkloggedIn}
            })
            .when('/surgeries/add',{
                templateUrl:'/html/surgery/add.html',
                controller:'surgeryCtrl',
                flag:'add',
                resolve:{'logged_in':checkloggedIn}
            })
            .otherwise({
                templateUrl:'/html/login.html',
                controller:'loginCtrl',
            });    
    }          
]);


