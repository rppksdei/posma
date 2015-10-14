myapp.controller('surgeryCtrl', function($scope, $route, Surgery, $location, $routeParams, $rootScope){
    $scope.surgeries = "";
    $scope.success = "";
    $scope.surgery = "";
    $scope.errordetail = [];
    
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
        Surgery.addSurgery().save(surgeryData, function(data){
            if(data.success){
                //$scope.success_message = data.success;
                $location.path('/surgeries');
            }else{
                if (data.error.errors){
                     $scope.errordetail = [];
                    for (var errName in data.error.errors) {
                        $scope.errordetail[errName] = data.error.errors[errName].message
                    }
                     console.log($scope.errordetail);
                }
                else{
                    //console.log(data.error.errors);
                    $scope.errordetail[data.error.path] = data.error.message;
                    console.log($scope.errordetail);
                }
            }
        });
    }

    $scope.edit = function(){
        $scope.error = [];
        var surgeryId = $routeParams.id;
        Surgery.getDetailId().save({'id': surgeryId}, function(data){
            if(data){
                //console.log(data);
                $scope.surgery = data;
                $scope.surgery.clinic_name = $rootScope.user.clinic_name;
            }
        });

        // Surgery.editSurgery().save({'id': surgeryId}, function(data){
        //     if (data.success) {
        //        // $rootScope.user = $scope.profileData;
        //         $scope.success_message = data.success;
        //     }else{
        //         $scope.error[data.error.path] = data.error.message;
        //         console.log($scope.error);
        //     }
        // });
    }
    
    
    if (flag == "get_surgery") {
        $scope.getSurgery();
    }else if (flag == "edit") {
        $scope.edit();
    }
    /* else if (flag == "add") {
        $scope.add();
    } */
    ;
});