angular.module('PosmaService', ['ngResource'])
    .factory('Login', function($resource){
        var serviceObj = {};
        serviceObj.admin = function(){
            return $resource('/login');  
        }
        serviceObj.logout = function(){
            return $resource('/login/loggedout');
        }
        serviceObj.cookieLogin = function(){
            return $resource('/login/cookieLogin');
        }
        return serviceObj;
    })
    .factory('Surgery', function($resource){
        var serviceObj = {};
        serviceObj.getDetail = function(){
            return $resource('/surgery');  
        }
        serviceObj.addSurgery = function(){
            return $resource('/surgery/add');
        }
        serviceObj.update = function(){
            return $resource('/surgery/update');
        }
        // serviceObj.editSurgery = function(){
        //     return $resource('/surgery/edit');
        // }
        serviceObj.getDetailId = function(){
            return $resource('/surgery/detail/');
        }
        // serviceObj.updateProfile = function(){
        //     return $resource('/profile/update');
        // }
        // serviceObj.changePassword = function(){
        //     return $resource('/profile/change_password');
        // }
        return serviceObj;
    })
    .factory('Profile', function($resource){
        var serviceObj = {};
        serviceObj.getDetail = function(){
            return $resource('/profile/detail');  
        }
        serviceObj.updateProfile = function(){
            return $resource('/profile/update');
        }
        serviceObj.changePassword = function(){
            return $resource('/profile/change_password');
        }
        return serviceObj;
    })
    .factory('Admin', function($resource){
        var serviceObj = {};
        serviceObj.getDetail = function(){
            return $resource('/manage_admin/detail');  
        }
        serviceObj.add = function(){
            return $resource('/manage_admin/add');
        }
        serviceObj.update = function(){
            return $resource('/manage_admin/update');
        }
        serviceObj.list = function(){
            return $resource('/manage_admin/');
        }
        return serviceObj;
    })
    .factory('Questions', function($resource){
        var serviceObj = {};

        serviceObj.getList = function(){
            return $resource('/question/');  
        }
        serviceObj.addQuestion = function(){
            return $resource('/question/add');  
        }
        serviceObj.updateQuestion = function(){
            return $resource('/question/update');  
        }
        serviceObj.getDetail = function(){
            return $resource('/question/getDetail');  
        }
        return serviceObj;
    })
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

