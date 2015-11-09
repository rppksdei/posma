//angular.module('MyAppService', ['ngResource']);
var myapp = angular.module("posma",['ang-drag-drop', '720kb.datepicker','angularjs-dropdown-multiselect','ngRoute',"ngTable", 'flash', 'PosmaService', 'ngCookies', "checklist-model",'angular-accordion']);
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
            .when('/add_institute',{
                templateUrl:'/html/admin/add.html',
                controller:'adminCtrl',
                flag:'add_admin',
                resolve:{'logged_in':checkloggedIn}
            })
            .when('/edit_institute/:id',{
                templateUrl:'/html/admin/add.html',
                controller:'adminCtrl',
                flag:'edit_admin',
                resolve:{'logged_in':checkloggedIn}
            })
            .when('/listinstitute',{
                templateUrl:'/html/admin/list.html',
                controller:'adminCtrl',
                flag:'list',
                resolve:{'logged_in':checkloggedIn}
            })
            .when('/surgeons',{
                templateUrl:'/html/surgeon/list.html',
                controller:'surgeonCtrl',
                flag:'list',
                resolve:{'logged_in':checkloggedIn}
            })
            .when('/edit_surgeon/:id',{
                templateUrl:'/html/surgeon/add.html',
                controller:'surgeonCtrl',
                flag:'edit_surgeon',
                resolve:{'logged_in':checkloggedIn}
            })
            .when('/add_surgeon',{
                templateUrl:'/html/surgeon/add.html',
                controller:'surgeonCtrl',
                flag:'add_surgeon',
                resolve:{'logged_in':checkloggedIn}
            })
            .when('/logout',{
                templateUrl:'/html/authenticate/login.html',
                controller:'loginCtrl',
                logout : true,
            })
            .when('/ngtables',{
                templateUrl:'/html/questions/ngtable.html',
                controller:'demoController as ',

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
            .when('/questions/dd',{
                templateUrl:'/html/questions/dd.html',
                controller:'questionsCtrl',
                flag:'dd',
                //resolve:{'logged_in':checkloggedIn}
            })
            .when('/questions/add/:id',{
                templateUrl:'/html/questions/add.html',
                controller:'questionsCtrl',
                flag:'edit',
                resolve:{'logged_in':checkloggedIn}
            })
            /*.when('/questionnaire',{
                templateUrl:'/html/questionnaire/list.html',
                controller:'questionnaireCtrl',
                flag:'get_questionnaire',
                resolve:{'logged_in':checkloggedIn}
            })*/
            .when('/questionnaires',{
                templateUrl:'/html/questionnaire/index.html',
                controller:'questionnaireCtrl',
                flag:'list',
                resolve:{'logged_in':checkloggedIn}
            })
            .when('/questionnaire/assign_questions/:id',{
                templateUrl:'/html/questionnaire/assign_questions.html',
                controller:'questionnaireCtrl',
                flag:'assign_ques',
                resolve:{'logged_in':checkloggedIn}
            })
            .when('/questionnaire/add',{
                templateUrl:'/html/questionnaire/add.html',
                controller:'questionnaireCtrl',
                flag:'add_questionnaire',
                resolve:{'logged_in':checkloggedIn}
            })
            .when('/questionnaire/edit/:id',{
                templateUrl:'/html/questionnaire/edit.html',
                controller:'questionnaireCtrl',
                flag:'edit',
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
            .when('/surgeries/edit/:id',{
                templateUrl:'/html/surgery/add.html',
                controller:'surgeryCtrl',
                flag:'edit',
                resolve:{'logged_in':checkloggedIn}
            })
            .when('/patients',{
                templateUrl:'/html/patients/list.html',
                controller:'patientCtrl',
                flag:'list',
                resolve:{'logged_in':checkloggedIn}
            })
            .when('/patients/add',{
                templateUrl:'/html/patients/add.html',
                controller:'patientCtrl',
                flag:'add',
                resolve:{'logged_in':checkloggedIn}
            })
            .when('/patients/edit/:id',{
                templateUrl:'/html/patients/add.html',
                controller:'patientCtrl',
                flag:'edit',
                resolve:{'logged_in':checkloggedIn}
            })
            .when('/pathways',{
                templateUrl:'/html/pathways/list.html',
                controller:'pathwayCtrl',
                flag:'list',
                resolve:{'logged_in':checkloggedIn}
            })
            .when('/pathways/add',{
                templateUrl:'/html/pathways/add.html',
                controller:'pathwayCtrl',
                flag:'add',
                resolve:{'logged_in':checkloggedIn}
            })
            .when('/pathways/edit/:id',{
                templateUrl:'/html/pathways/add.html',
                controller:'pathwayCtrl',
                flag:'edit',
                resolve:{'logged_in':checkloggedIn}
            })
            .when('/pathways/assignquestionnaires/:id',{
                templateUrl:'/html/pathways/assign.html',
                controller:'pathwayCtrl',
                flag:'assign',
                resolve:{'logged_in':checkloggedIn}
            })
            .otherwise({
                templateUrl:'/html/login.html',
                controller:'loginCtrl',
            });    
    }          
]);


