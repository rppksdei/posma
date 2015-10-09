myapp.controller('adminCtrl', function($scope, $route, Admin, $location,Flash, ngTableParams, $rootScope){
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
                Flash.create('success', 'Clinic saved successfully', 'alert alert-success');
                $location.path('/listadmin');
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
            $scope.tableParams = new ngTableParams({count:5}, {counts:{}, data:data});
        });
    }
    
    if (flag == "list") {
        $scope.listAdmin();
    }
});