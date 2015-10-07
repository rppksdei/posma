myapp.controller('loginCtrl', function($scope, $route, Login, $location, $rootScope){
    $scope.error_message = "";
    $scope.login = "";
    $scope.login.username = "";
    $scope.login.password = "";
    
    var logout = false;
    if (typeof $route.current.$$route.logout !== 'undefined') {
        logout = $route.current.$$route.logout;
    }
    if (logout == true) {
        Login.logout().get({}, function(data){
           if(data.success == true){
              $rootScope.user = {};
              $location.path('/');
           }
           else{
             $location.path('/dashboard');
           }
        });
    }
    
    $scope.sign_in = function(){
        console.log($scope.login);
        Login.admin().save($scope.login, function(data){
            if (!data.error) {
                $location.path('/dashboard');
            }
            else{
                $scope.error_message = data.message;
            } 
        });
    }
});