var authHeader = {
                            query: {
                                method: 'GET',
                                headers: { 'auth-token': 'test' }
                            },
                            save: {
                                method: 'POST',
                                headers: { 'auth-token': 'test' }
                            }
                        };
//var authHeader = {};
angular.module('PosmaService', ['ngResource'])
    .factory('Login', function($resource){
        var serviceObj = {};
        serviceObj.admin = function(){
            return $resource('/login',{},authHeader);  
        }
        serviceObj.logout = function(){
            return $resource('/login/loggedout',{},authHeader);
        }
        serviceObj.cookieLogin = function(){
            return $resource('/login/cookieLogin',{},authHeader);
        }
        return serviceObj;
    })
    .factory('Surgery', function($resource){
        var serviceObj = {};
        serviceObj.getDetail = function(){
            return $resource('/surgery',{}, authHeader);  
        }
        serviceObj.addSurgery = function(){
            return $resource('/surgery/add',{},authHeader);
        }
        serviceObj.update = function(){
            return $resource('/surgery/update',{},authHeader);
        }
        serviceObj.getDetailId = function(){
            return $resource('/surgery/detail/',{},authHeader);
        }
        return serviceObj;
    })
    .factory('Admin', function($resource){
        var serviceObj = {};
        serviceObj.getDetail = function(){
            return $resource('/manage_admin/detail',{},authHeader);  
        }
        serviceObj.add = function(){
            return $resource('/manage_admin/add',{},authHeader);
        }
        serviceObj.update = function(){
            return $resource('/manage_admin/update',{},authHeader);
        }
        serviceObj.list = function(){
            return $resource('/manage_admin/',{},authHeader);
        }
        return serviceObj;
    })
    .factory('Profile', function($resource){
        var serviceObj = {};
        serviceObj.getDetail = function(){
            return $resource('/profile/detail',{},authHeader);  
        }
        serviceObj.updateProfile = function(){
            return $resource('/profile/update',{},authHeader);
        }
        serviceObj.changePassword = function(){
            return $resource('/profile/change_password',{},authHeader);
        }
        return serviceObj;
    })
    .factory('Patient', function($resource){
        var serviceObj = {};
        serviceObj.getList = function(){
            return $resource('/patient/',{},authHeader);
        }
        serviceObj.addPatient = function(){
            return $resource('/patient/add',{},authHeader);
        }
        serviceObj.update = function(){
            return $resource('/patient/update',{},authHeader);
        }
        serviceObj.getDetail = function(){
            return $resource('/pathway/',{},authHeader);
        }
        serviceObj.getDetailId = function(){
            return $resource('/patient/detail/',{},authHeader);
        }
        // serviceObj.getAddDetails = function(){            
        //     return $resource('/surgery');
        // }
        return serviceObj;
    })
    .factory('Questionnaire', function($resource){
        var serviceObj = {};
        serviceObj.getDetail = function(){
            return $resource('/questionnaire/getDetail',{},authHeader);
        }
        serviceObj.add = function(){
            return $resource('/questionnaire/add',{},authHeader);
        }
        serviceObj.update = function(){
            return $resource('/questionnaire/update',{},authHeader);
        }
        serviceObj.list = function(){
            return $resource('/questionnaire/',{},authHeader);
        }
        return serviceObj;
    })
    .factory('Questions', function($resource){
        var serviceObj = {};

        serviceObj.getList = function(){
            return $resource('/question/',{},authHeader);  
        }
        serviceObj.addQuestion = function(){
            return $resource('/question/add',{},authHeader);  
        }
        serviceObj.updateQuestion = function(){
            return $resource('/question/update',{},authHeader);  
        }
        serviceObj.getDetail = function(){
            return $resource('/question/getDetail',{},authHeader);  
        }
        return serviceObj;
    })
    .factory('Pathway', function($resource){
        var serviceObj = {};
        serviceObj.getList = function(){
            return $resource('/pathway/',{},authHeader);
        }
        serviceObj.addPathway = function(){
            return $resource('/pathway/add',{},authHeader);
        }
        serviceObj.update = function(){
            return $resource('/pathway/update',{},authHeader);
        }
        serviceObj.getDetail = function(){
            return $resource('/pathway/',{},authHeader);
        }
        serviceObj.getDetailId = function(){
            return $resource('/pathway/detail/',{},authHeader);
        }
        return serviceObj;
    })
    // .factory('PatientQuestionnaire', function($resource){
    //     var serviceObj = {};
    //     serviceObj.saveAssign = function(){
    //         return $resource('/patient_questionnaire/add');
    //     }
    //     return serviceObj;
    // })
    .factory('myService', function() {
        return {
            foo: function() {
                alert("I'm foo!");
            }
        };
    })
    .factory('SweetAlert', [ function ( ) {
        var swal = window.swal;
        //public methods
        var self = {
            swal: function ( arg1, arg2, arg3 ) {
                swal( arg1, arg2, arg3 );
            },
            success: function(title, message) {
                swal( title, message, 'success' );
            },
            error: function(title, message) {
                swal( title, message, 'error' );
            },
            warning: function(title, message) {
                swal( title, message, 'warning' );
            },
            info: function(title, message) {    
                swal( title, message, 'info' );
            }
        };
        return self;
    }])
    .service("NameService", function($http, $filter){
        function filterData(data, filter){
            return $filter('filter')(data, filter)
        }
    });

