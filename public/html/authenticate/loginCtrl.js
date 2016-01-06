myapp.controller('loginCtrl', function($scope, $route, Login, $location, $rootScope, $cookies){
    $scope.error_message = "";
    $scope.login = "";
    $scope.login.username = "";
    $scope.login.password = "";
    
    var expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + 30);
    console.log(expireDate);
    
    var logout = false;
    if (typeof $route.current.$$route.logout !== 'undefined') {
        logout = $route.current.$$route.logout;
    }
    if (logout == true) {
        Login.logout().get({}, function(data){
            if(data.success == true){
                $cookies.remove('user_id');
                $rootScope.user = {};
                $location.path('/login');
            } else{
                $location.path('/dashboard');
            }
        });
    }
    
    // code to access application through cookies
    var cookie_id = $cookies.get('user_id');
    if (cookie_id && logout == false) {
        Login.cookieLogin().save({'cookie_id':cookie_id}, function(data){

                //alert(location.path());
            if (!data.error) {
                $location.path('/dashboard');
            }
            else{
                $scope.error_message = data.message;
            } 
        });
    }
    // End of code for access through cookies
    
    $scope.sign_in = function(){
        Login.admin().save($scope.login, function(data){
            if (!data.error) {
                if ($scope.remember === true){
                    var expireDate = new Date();
                    expireDate.setDate(expireDate.getDate() + 30);
                    $cookies.put('user_id', data.user_id, {'expires': expireDate});
                }
                $location.path('/dashboard');
            }
            else{
                $scope.error_message = data.message;
            } 
        });
    }
});