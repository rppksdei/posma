myapp.controller('surgeryCtrl', function($scope, $route, Surgery, $location, $rootScope){
    $scope.profileData = "";
    $scope.success = "";
    $scope.ch_pass = "";
    $scope.ch_pass.current_password = "";
    $scope.ch_pass.confirm_password = "";
    $scope.ch_pass.new_password = "";
    
    var flag = '';
    if (typeof $route.current.$$route.flag !== 'undefined') {
        flag = $route.current.$$route.flag;
    }
    $scope.getSurgery = function(){
        Surgery.getDetail().get({}, function(data){
            $scope.profileData = data;
        });    
    }
    $scope.updateProfile = function(){
        $scope.error = [];
        Profile.updateProfile().save($scope.profileData, function(data){
            if (data.success) {
                $rootScope.user = $scope.profileData;
                $scope.success_message = data.success;
            }
            else{
                $scope.error[data.error.path] = data.error.message;
                console.log($scope.error);
            }
        });
    }
    $scope.changePassword = function(){
        $scope.error = [];
        Profile.changePassword().save($scope.ch_pass, function(data){
           if (data.success) {
                $scope.success_message = data.success;
           }
           else{
                $scope.error['current_password'] = data.error;
           }
        });
        //Profile.
    }
    
    if (flag == "get_surgery") {
        $scope.getSurgery();
    }
});