myapp.controller('surgeryCtrl', function($scope, $route, Surgery, $location, Flash, $routeParams, ngTableParams, $rootScope, SweetAlert){
    $scope.surgeries = [];
    $scope.success = "";
    $scope.surgery = "";
    $scope.errordetail = [];
    $scope.page_title = "Add Surgery";
    $scope.page_button= "Add Surgery";
    
    var flag = '';
    if (typeof $route.current.$$route.flag !== 'undefined') {
        flag = $route.current.$$route.flag;
    }
    $scope.getSurgery = function(){
        Surgery.getDetail().query({}, function(data){
            $scope.surgeries = data;
            $scope.tableParams = new ngTableParams({count:5}, {counts:{}, data:$scope.surgeries});
        });    
    }

    $scope.add = function(){
        var surgeryData = $scope.surgery;
        Surgery.addSurgery().save(surgeryData, function(data){
            if(data.success){
                if($scope.surgery._id){
                    Flash.create('success', 'Surgery has been updated successfully.', 'alert alert-success');
                } else{
                    Flash.create('success', 'Surgery has been added successfully.', 'alert alert-success');
                }
                $location.path('/surgeries');
            } else{
                if (data.error.errors){
                    $scope.errordetail = [];
                    for (var errName in data.error.errors) {
                        $scope.errordetail[errName] = data.error.errors[errName].message
                    }
                    console.log($scope.errordetail);
                } else{
                    $scope.errordetail[data.error.path] = data.error.message;
                    console.log($scope.errordetail);
                }
            }
        });
    }

    $scope.edit = function(){
        $scope.error = [];
        $scope.page_title = "Edit Surgery";
        $scope.page_button = "Update Surgery";
        var surgeryId = $routeParams.id;
        Surgery.getDetailId().save({'id': surgeryId}, function(data){
            if(data){
                //console.log(data);
                $scope.surgery = data;
                $scope.surgery.clinic_name = $rootScope.user.clinic_name;
            }
        });
    }
    
    $scope.deleteSurgery = function(id,surName) {
        SweetAlert.swal({
        title: "Are you sure you want to delete '"+surName+"'?",
        text: "You will not be able to recover it!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel it!",
        closeOnConfirm: true}, 
        function(){
            var update_object = {'_id':id, 'is_deleted':1};
            Surgery.update().save(update_object, function(data){
                if (data.success) {
                    var del_index = 0;
                    for(i=0;(i < $scope.surgeries.length); i++){
                        if($scope.surgeries[i]._id == id){
                            del_index = i;
                            break;
                        }
                    }
                    $scope.surgeries.splice(del_index, 1);
                    $scope.tableParams = new ngTableParams({count:5}, {counts:{}, data:$scope.surgeries});
                    Flash.create('success', 'Surgery has been deleted successfully.', 'alert alert-success');
                }
            }); 
        });
    };

    $scope.changeSurgeryStatus = function(index) {
        var object_detail = $scope.tableParams.data[index];
        SweetAlert.swal({
        title: "Are you sure?",
        text: "you want to change status of "+object_detail.name+" ",
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
            Surgery.update().save(update_object, function(data){
                if (data.success) {
                    $scope.tableParams.data[index].is_active = status;
                    Flash.create('success', 'Surgery status has been updated successfully.', 'alert alert-success');
                }
            });
        });
    };
    
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