myapp.controller('profileCtrl', function($scope, $route, Profile, $location, $rootScope){
    $scope.error_message = "";
    $scope.profileData = "";
    Profile.getDetail().get({}, function(data){
        $scope.profileData = data;
    });
    
    $scope.updateProfile = function(){
        console.log($scope.profileData);
        Profile.updateProfile().save($scope.profileData, function(data){
            if (data.success) {
                $rootScope.user = $scope.profileData;
            }
        });
    }
});