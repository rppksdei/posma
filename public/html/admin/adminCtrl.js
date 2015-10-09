myapp.controller('adminCtrl', function($scope, $route, Admin, $location, $rootScope){
    $scope.profileData = "";
    $scope.success = "";
    $scope.listAdmin = "";
    $scope.errordetail = [];
    var flag = '';
    if (typeof $route.current.$$route.flag !== 'undefined') {
        flag = $route.current.$$route.flag;
    }
    
    $scope.add = function(){
        Admin.add().save($scope.admin, function(data){
           if (data.success) {
                $rootScope.user = $scope.profileData;
                $scope.success_message = data.success;
            }
            else{
                if (data.error.errors){
                     $scope.errordetail = [];
                    for (var errName in data.error.errors) {
                        $scope.errordetail[errName] = data.error.errors[errName].message
                    }
                }
            }
        });
    }
    
    $scope.listAdmin = function(){
        Admin.list().query({}, function(data){
            $scope.listAdmin = data;
        });
    }
    
    if (flag == "list") {
        $scope.listAdmin();
    }
});