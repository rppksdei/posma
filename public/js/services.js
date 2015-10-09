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
    .factory('Questions', function($resource){
        var serviceObj = {};

        serviceObj.getList = function(){
            return $resource('/question/');  
        }
        serviceObj.addQuestion = function(){
            return $resource('/question/add');  
        }
        return serviceObj;
    });

