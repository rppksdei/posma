myapp.controller('surgeonCtrl', function($scope, $route, Admin, Surgery, $location,Flash, ngTableParams, $rootScope, $routeParams, SweetAlert){
    $scope.success = "";
    $scope.listAdmin = "";
    $scope.errordetail = [];
    $scope.form_heading = 'Add Surgeon';
    $scope.whole_data = [];
    $scope.surgeries = [];
    
    // Initialize variable
    $scope.admin = {};
    //End of code to initialize variable
    var flag = '';
    if (typeof $route.current.$$route.flag !== 'undefined') {
        flag = $route.current.$$route.flag;
    }
    
    // get surgery list
    if (flag == "add_surgeon" || flag == "edit_surgeon") {
        Surgery.getDetail().query({}, function(data){
            $scope.surgeries = data;
        });    
    }
    //End of code to get surgery list
    
    
    $scope.add = function(){
        if ($scope.admin._id) {
            Admin.update().save($scope.admin, function(data){
                $scope.errordetail = {};
               if (data.success) {
                    Flash.create('success', 'Surgeon has been updated successfully.', 'alert alert-success');
                    $location.path('/surgeons');
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
                    Flash.create('success', 'Surgeon has been saved successfully.', 'alert alert-success');
                    $location.path('/surgeons');
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
                    }
                }
            });
        }
    }
    
    $scope.editAdmin = function(){
        $scope.form_heading = 'Update Surgeon';
        $scope.editProfileId = $routeParams.id;
        $scope.admin = {};
        Admin.getDetail().save({'id':$scope.editProfileId}, function(data){
            $scope.admin = data;
        });
    }
    
    $scope.changeClinicStatus = function(index) {
        var object_detail = $scope.tableParams.data[index];
        SweetAlert.swal({
        title: "Are you sure?",
        text: "you want to change status of "+object_detail.clinic_name+" ",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, change it!",
        cancelButtonText: "No, cancel it!",
        closeOnConfirm: true}, 
        function(){ 
            var status = 0;
            if (object_detail.is_active == 0) {
                status = 1;
            }
            var update_object = {'_id':object_detail._id, 'is_active':status};
            console.log(update_object);
            Admin.update().save(update_object, function(data){
                if (data.success) {
                    $scope.tableParams.data[index].is_active = status;
                    Flash.create('success', 'Surgeon status has been updated successfully.', 'alert alert-success');
                }
            });
        });
    };
    
    $scope.deleteClinic = function(id) {
        
        SweetAlert.swal({
        title: "Are you sure?",
        text: "Your will not be able to recover surgeon !",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel it!",
        closeOnConfirm: true}, 
        function(){ 
            var update_object = {'_id':id, 'is_deleted':1};
            Admin.update().save(update_object, function(data){
                if (data.success) {
                    var del_index = 0;
                    for(i=0;(i < $scope.whole_data.length); i++){
                        if($scope.whole_data[i]._id == id){
                            del_index = i;
                            break;
                        }
                    }
                    $scope.whole_data.splice(del_index, 1);
                    $scope.tableParams = new ngTableParams({count:5}, {counts:{}, data:$scope.whole_data});
                    Flash.create('success', 'Surgeon has been deleted successfully.', 'alert alert-success');
                }
            }); 
        });
        
    };
   
    $scope.listAdmin = function(){
        Admin.list().query({}, function(data){
            $scope.whole_data = data;
            $scope.tableParams = new ngTableParams({count:5}, {counts:{}, data:$scope.whole_data});
        });
    }
    
    if (flag == "list") {
        $scope.listAdmin();
    }
    else if (flag == "edit_surgeon") {
        $scope.editAdmin();
    }
});