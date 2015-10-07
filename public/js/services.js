angular.module('PosmaService', ['ngResource'])
    .factory('Login', function($resource){
        var serviceObj = {};
        serviceObj.admin = function(){
            return $resource('/login');  
        }
        serviceObj.logout = function(){
            return $resource('/login/loggedout');
        }
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
        return serviceObj;
    });

