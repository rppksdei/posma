myapp.controller('surgeryCtrl', function($scope, $route, Surgery, $location, $rootScope){
    $scope.surgeries = "";
    $scope.success = "";
    $scope.surgery = "";
    // $scope.ch_pass = "";
    // $scope.ch_pass.current_password = "";
    // $scope.ch_pass.confirm_password = "";
    // $scope.ch_pass.new_password = "";
    
    var flag = '';
    if (typeof $route.current.$$route.flag !== 'undefined') {
        flag = $route.current.$$route.flag;
    }
    $scope.getSurgery = function(){
        Surgery.getDetail().query({}, function(data){
            $scope.surgeries = data;
        });    
    }
    $scope.add = function(){
        var surgeryData = $scope.surgery;
        console.log(surgeryData);
        Surgery.addSurgery().save(surgeryData, function(data){
            if(data.success){
                $scope.success_message = data.success;
            }
            else{
                // $scope.error[data.error.path] = data.error.message;
                // console.log($scope.error);
            }
        });
    }
    // $scope.updateProfile = function(){
    //     $scope.error = [];
    //     Profile.updateProfile().save($scope.profileData, function(data){
    //         if (data.success) {
    //             $rootScope.user = $scope.profileData;
    //             $scope.success_message = data.success;
    //         }
    //         else{
    //             $scope.error[data.error.path] = data.error.message;
    //             console.log($scope.error);
    //         }
    //     });
    // }
    
    
    if (flag == "get_surgery") {
        $scope.getSurgery();
    } /* else if (flag == "add") {
        $scope.add();
    } */
    ;
});