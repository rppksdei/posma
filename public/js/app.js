//angular.module('MyAppService', ['ngResource']); 
var myapp = angular.module("posma",['ngTableToCsv','ngSanitize', 'ngCsv','ang-drag-drop', '720kb.datepicker','angularjs-dropdown-multiselect','ngRoute',"ngTable", 'flash', 'PosmaService', 'ngCookies', "checklist-model",'angular-accordion','angularMoment','mdo-angular-cryptography']);
var authScope = '1234567890po23sm45a56';

function checkloggedIn($rootScope, $http, $location) {
    $http.get('/login/checkloggedin', {headers: {'auth-token': authScope}}).success(function(data) {
        if (data.error) {
            $location.path('/login');
        }
        else{
            $rootScope.user = data;
        }
    });  
}

function checkloggedInSuperAdmin($rootScope, $http, $location) {
    $http.get('/login/checkloggedin', {headers: {'auth-token': authScope}}).success(function(data) {
        if (data.error) {
            $location.path('/login');
        }
        else{
            if (data.user_type==1) { // if superadmin
                $location.path('/unauthorized');
            }else{
                $rootScope.user = data;
            }
        }
    });  
}

function checkloggedInInstitution($rootScope, $http, $location, $routeParams) {
    $http.get('/login/checkloggedin', {headers: {'auth-token': authScope}}).success(function(data) {
        if (data.error) {
            $location.path('/login');
        }
        else{
            if (data.user_type==1) { // if superadmin
                $location.path('/unauthorized');
            }else{
                var patientId = $routeParams.id;
            console.log('data = ', data);
            console.log('patientId = ', patientId);
            var pdata = {};
                pdata.id = patientId;
                console.log('authScope = ', authScope);
                //pdata.field = {'clinic':1};
                $http.post('/patient/detail', pdata, {headers: {'auth-token': authScope}}).success(function(ndata) {
                //$http.post('/login/currentUserCheckLogin', data, {headers: {'auth-token': authScope}}).success(function(ndata) {
                    console.log('ndata==', ndata);
                    if (data._id==ndata.clinic._id) {
                        $rootScope.user = data;
                    }else{
                        $location.path('/unauthorized');
                    }
                });
                //$rootScope.user = data;
            }
        }
    });  
}

myapp.config(['$cryptoProvider', function($cryptoProvider){
    $cryptoProvider.setCryptographyKey('ABCD123');
}]);
myapp.config(['$routeProvider',
    function ($routeProvider){
        $routeProvider
            .when ('/login', {
                templateUrl:'/html/authenticate/login.html',
                controller:'loginCtrl',
            })
            .when ('/', {
                templateUrl:'/html/dashboard/dashboard.html',
                controller:'dashboardCtrl',
                flag:'listalerts',
                resolve:{'logged_in':checkloggedIn}

            })
            .when('/dashboard',{
                templateUrl:'/html/dashboard/dashboard.html',
                controller:'dashboardCtrl',
                flag:'listalerts',
                resolve:{'logged_in':checkloggedIn}
                //templateUrl:'/html/reports/index.html',
                //controller:'reportsCtrl',
                //flag:'report',
                //resolve:{'logged_in':checkloggedIn}
            })
            .when('/alerts/detail/:id',{
                templateUrl:'/html/dashboard/detail.html',
                controller:'dashboardCtrl',
                flag:'alert_detail',
                resolve:{'logged_in':checkloggedInSuperAdmin}
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
                resolve:{'logged_in':checkloggedInSuperAdmin}
            })
            .when('/edit_surgeon/:id',{
                templateUrl:'/html/surgeon/add.html',
                controller:'surgeonCtrl',
                flag:'edit_surgeon',
                resolve:{'logged_in':checkloggedInSuperAdmin}
            })
            .when('/add_surgeon',{
                templateUrl:'/html/surgeon/add.html',
                controller:'surgeonCtrl',
                flag:'add_surgeon',
                resolve:{'logged_in':checkloggedInSuperAdmin}
            })
            .when('/reports',{
                templateUrl:'/html/reports/index.html',
                controller:'reportsCtrl',
                flag:'report',
                resolve:{'logged_in':checkloggedInSuperAdmin}
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
                resolve:{'logged_in':checkloggedInSuperAdmin}
            })
            .when('/questions/add',{
                templateUrl:'/html/questions/add.html',
                controller:'questionsCtrl',
                flag:'add',
                resolve:{'logged_in':checkloggedInSuperAdmin}
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
                resolve:{'logged_in':checkloggedInSuperAdmin}
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
                resolve:{'logged_in':checkloggedInSuperAdmin}
            })
            .when('/questionnaire/assign_questions/:id',{
                templateUrl:'/html/questionnaire/assign_questions.html',
                controller:'questionnaireCtrl',
                flag:'assign_ques',
                resolve:{'logged_in':checkloggedInSuperAdmin}
            })
            .when('/questionnaire/add',{
                templateUrl:'/html/questionnaire/add.html',
                controller:'questionnaireCtrl',
                flag:'add_questionnaire',
                resolve:{'logged_in':checkloggedInSuperAdmin}
            })
            .when('/questionnaire/edit/:id',{
                templateUrl:'/html/questionnaire/edit.html',
                controller:'questionnaireCtrl',
                flag:'edit',
                resolve:{'logged_in':checkloggedInSuperAdmin}
            })
            .when('/surgeries',{
                templateUrl:'/html/surgery/surgeries.html',
                controller:'surgeryCtrl',
                flag:'get_surgery',
                resolve:{'logged_in':checkloggedInSuperAdmin}
            })
            .when('/surgeries/add',{
                templateUrl:'/html/surgery/add.html',
                controller:'surgeryCtrl',
                flag:'add',
                resolve:{'logged_in':checkloggedInSuperAdmin}
            })
            .when('/surgeries/edit/:id',{
                templateUrl:'/html/surgery/add.html',
                controller:'surgeryCtrl',
                flag:'edit',
                resolve:{'logged_in':checkloggedInSuperAdmin}
            })
            .when('/patients',{
                templateUrl:'/html/patients/list.html',
                controller:'patientCtrl',
                flag:'list',
                resolve:{'logged_in':checkloggedInSuperAdmin}
            })
            .when('/patients/add',{
                templateUrl:'/html/patients/add.html',
                controller:'patientCtrl',
                flag:'add',
                resolve:{'logged_in':checkloggedInSuperAdmin}
            })
            .when('/patients/edit/:id',{
                templateUrl:'/html/patients/add.html',
                controller:'patientCtrl',
                flag:'edit',
                resolve:{'logged_in':checkloggedInInstitution}
            })
            .when('/patients/history/:id',{
                templateUrl:'/html/patients/history.html',
                controller:'patientCtrl',
                flag:'historyHR',
                resolve:{'logged_in':checkloggedInSuperAdmin}
            })
            .when('/patients/history/steps/:id',{
                templateUrl:'/html/patients/history.html',
                controller:'patientCtrl',
                flag:'historySteps',
                resolve:{'logged_in':checkloggedInSuperAdmin}
            })
            .when('/pathways',{
                templateUrl:'/html/pathways/list.html',
                controller:'pathwayCtrl',
                flag:'list',
                resolve:{'logged_in':checkloggedInSuperAdmin}
            })
            .when('/pathways/add',{
                templateUrl:'/html/pathways/add.html',
                controller:'pathwayCtrl',
                flag:'add',
                resolve:{'logged_in':checkloggedInSuperAdmin}
            })
            .when('/pathways/edit/:id',{
                templateUrl:'/html/pathways/add.html',
                controller:'pathwayCtrl',
                flag:'edit',
                resolve:{'logged_in':checkloggedInSuperAdmin}
            })
            .when('/pathways/assignquestionnaires/:id',{
                templateUrl:'/html/pathways/assign.html',
                controller:'pathwayCtrl',
                flag:'assign',
                resolve:{'logged_in':checkloggedInSuperAdmin}
            })
            
            .when('/fitbit/authorize/:id',{
                templateUrl:'/html/fitbit/list.html',
                controller:'fitbitCtrl',
                flag:'authorize',
                resolve:{'logged_in':checkloggedInSuperAdmin}
            })
            .when('/unauthorized',{
                templateUrl:'/html/dashboard/unauthorized.html',
                controller:'dashboardCtrl'
            })
            .otherwise({
                templateUrl:'/html/login.html',
                controller:'loginCtrl',
            });    
    }          
]);