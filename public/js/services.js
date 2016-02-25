    var authScope = '1234567890po23sm45a56';
    var authHeader = {
                            query: {
                                method: 'GET',
                                isArray: true,
                                headers: { 'auth-token': authScope }
                            },
                            save: {
                                method: 'POST',
                                headers: { 'auth-token': authScope }
                            },
                            get: {
                                method: 'GET',
                                headers: { 'auth-token': authScope }
                            }
                        };
                        
    
    
    angular.module('PosmaService', ['ngResource'])
    .factory('Login', function($resource){
        var serviceObj = {};
        serviceObj.admin = function(){
            //return $resource('/login');  
            return $resource('/login', {}, authHeader);  
        }
        serviceObj.logout = function(){
            return $resource('/login/loggedout', {}, authHeader);
        }
        serviceObj.cookieLogin = function(){
            return $resource('/login/cookieLogin', {}, authHeader);
        }
        return serviceObj;
    })
    .factory('Surgery', function($resource){
        var serviceObj = {};
        serviceObj.getDetail = function(){
            return $resource('/surgery', {}, authHeader);  
        }
        serviceObj.addSurgery = function(){
            return $resource('/surgery/add', {}, authHeader);
        }
        serviceObj.update = function(){
            return $resource('/surgery/update', {}, authHeader);
        }
        serviceObj.getDetailId = function(){
            return $resource('/surgery/detail/', {}, authHeader);
        }
        return serviceObj;
    })
    .factory('Admin', function($resource){
        var serviceObj = {};
        serviceObj.getDetail = function(){
            return $resource('/manage_admin/detail', {}, authHeader);  
        }
        serviceObj.add = function(){
            return $resource('/manage_admin/add', {}, authHeader);
        }
        serviceObj.update = function(){
            return $resource('/manage_admin/update', {}, authHeader);
        }
        serviceObj.list = function(){
            return $resource('/manage_admin/', {}, authHeader);
        }
        return serviceObj;
    })
    .factory('State', function($resource){
        var serviceObj = {};
        serviceObj.listState = function(){
            return $resource('/states/getstates', {}, authHeader);
        }
        return serviceObj;
    })
    .factory('Profile', function($resource){
        var serviceObj = {};
        serviceObj.getDetail = function(){
            return $resource('/profile/detail', {}, authHeader);  
        }
        serviceObj.updateProfile = function(){
            return $resource('/profile/update', {}, authHeader);
        }
        serviceObj.changePassword = function(){
            return $resource('/profile/change_password', {}, authHeader);
        }
        return serviceObj;
    })
    .factory('Patient', function($resource){
        var serviceObj = {};
        serviceObj.getList = function(){
            return $resource('/patient/', {}, authHeader);
        }
        serviceObj.addPatient = function(){
            return $resource('/patient/add', {}, authHeader);
        }
        serviceObj.update = function(){
            return $resource('/patient/update', {}, authHeader);
        }
        serviceObj.getDetail = function(){
            return $resource('/pathway/', {}, authHeader);
        }
        serviceObj.getDetailId = function(){
            return $resource('/patient/detail/', {}, authHeader);
        }
        // serviceObj.getAddDetails = function(){            
        //     return $resource('/surgery');
        // }
        return serviceObj;
    })
    .factory('Fitbit', function($resource){
        var serviceObj = {};
        serviceObj.authorize = function(){
            return $resource('/fitbit/authorize', {}, authHeader);
        }
        serviceObj.getFitbitData = function(){
            console.log('---in service ---');
            //authHeader.query.isArray = true;
            return $resource('/fitbit/getFitbitData', {}, authHeader);
        }
        serviceObj.getFitbitSteps = function(){
            //var authstep = authHeader;
            //authstep.query.isArray = false;
            return $resource('/fitbit/getFitbitSteps', {}, authHeader);
        }
        return serviceObj;
    })
    .factory('Questionnaire', function($resource){
        var serviceObj = {};
        serviceObj.getDetail = function(){
            return $resource('/questionnaires/getDetail', {}, authHeader);
        }
        serviceObj.add = function(){
            return $resource('/questionnaires/add', {}, authHeader);
        }
        serviceObj.update = function(){
            return $resource('/questionnaires/update', {}, authHeader);
        }
        serviceObj.list = function(){
            return $resource('/questionnaires/', {}, authHeader);
        }
        return serviceObj;
    })
    .factory('Alerts', function($resource){
        var serviceObj = {};
        serviceObj.getDetail = function(){
            return $resource('/alerts/getDetail', {}, authHeader);
        }
        serviceObj.list = function(){
            return $resource('/alerts/', {}, authHeader);
        }
        serviceObj.addNote = function(){
            return $resource('/alerts/add_notes', {}, authHeader);
        }
        return serviceObj;
    })
    .factory('Report', function($resource){
        var serviceObj = {};
        serviceObj.list = function(){
            return $resource('/reports', {}, authHeader);
        }
        serviceObj.getalert = function(){
            return $resource('/alerts/getPatientalert', {}, authHeader);
        }
        return serviceObj;
    })
    .factory('Questions', function($resource){
        var serviceObj = {};

        serviceObj.getList = function(){
            return $resource('/question/', {}, authHeader);
        }
        serviceObj.addQuestion = function(){
            return $resource('/question/add', {}, authHeader);
        }
        serviceObj.updateQuestion = function(){
            return $resource('/question/update', {}, authHeader);
        }
        serviceObj.getDetail = function(){
            return $resource('/question/getDetail', {}, authHeader);  
        }
        return serviceObj;
    })
    .factory('Pathway', function($resource){
        var serviceObj = {};
        serviceObj.getList = function(){
            return $resource('/pathway/', {}, authHeader);
        }
        serviceObj.addPathway = function(){
            return $resource('/pathway/add', {}, authHeader);
        }
        serviceObj.update = function(){
            return $resource('/pathway/update', {}, authHeader);
        }
        serviceObj.getDetail = function(){
            return $resource('/pathway/', {}, authHeader);
        }
        serviceObj.getDetailId = function(){
            return $resource('/pathway/detail/', {}, authHeader);
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
    .factory('SweetAlert', [function( ){
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
