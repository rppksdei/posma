myapp.controller('adminCtrl', function($scope, $route, Admin, $location,Flash, ngTableParams, $rootScope, $routeParams,confirmBox){
    $scope.success = "";
    $scope.listAdmin = "";
    $scope.errordetail = [];
    $scope.form_heading = 'Add Institute';
    var flag = '';
    if (typeof $route.current.$$route.flag !== 'undefined') {
        flag = $route.current.$$route.flag;
    }
    
    $scope.add = function(){
        if ($scope.admin._id) {
            Admin.update().save($scope.admin, function(data){
                $scope.errordetail = {};
               if (data.success) {
                    Flash.create('success', 'Institute has been updated successfully.', 'alert alert-success');
                    $location.path('/listinstitute');
                }
                else{
                    if (data.error.errors){
                         $scope.errordetail = [];
                        for (var errName in data.error.errors) {
                            $scope.errordetail[errName] = data.error.errors[errName].message
                        }
                    }
                    else{
                       $scope.errordetail[data.error.path] = data.error.message;
                        console.log($scope.error);
                    }
                }
            });
        }
        else{
            Admin.add().save($scope.admin, function(data){
               if (data.success) {
                    Flash.create('success', 'Institute has been saved successfully.', 'alert alert-success');
                    $location.path('/listinstitute');
                }
                else{
                    if (data.error.errors){
                         $scope.errordetail = [];
                        for (var errName in data.error.errors) {
                            $scope.errordetail[errName] = data.error.errors[errName].message
                        }
                    }
                    else{
                       $scope.errordetail[data.error.path] = data.error.message;
                        console.log($scope.error);
                    }
                }
            });
        }
    }
    
    $scope.editAdmin = function(){
        $scope.form_heading = 'Update Institute';
        $scope.editProfileId = $routeParams.id;
        $scope.admin = {};
        Admin.getDetail().save({'id':$scope.editProfileId}, function(data){
            $scope.admin = data;
        });
    }
    $scope.changeClinicStatus = function(index){
        console.log("Change Status");
        var object_id = $scope.tableParams.data[index]._id;
        var status = 0;
        if ($scope.tableParams.data[index].is_active == 0) {
            status = 1;
        }
        var update_object = {'_id':object_id, 'is_active':status};
        console.log(update_object);
        Admin.update().save(update_object, function(data){
            if (data.success) {
                $scope.tableParams.data[index].is_active = status;
                Flash.create('success', 'Clinic has been deleted successfully.', 'alert alert-success');
            }
        });
    }  
    $scope.deleteClinic = function(index) {
        console.log("Delete Clinic");
        var object_id = $scope.tableParams.data[index]._id;
        var update_object = {'admin_id':object_id, 'is_deleted':1};
        Admin.update().save(update_object, function(data){
            if (data.success) {
                $scope.tableParams.data.splice(index, 1);
                Flash.create('success', 'Clinic has been deleted successfully.', 'alert alert-success');
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
    else if (flag == "edit_admin") {
        $scope.editAdmin();
    }
});