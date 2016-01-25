myapp.controller('adminCtrl', function($scope, $route, Admin, State, $location,Flash, ngTableParams, $rootScope, $routeParams, SweetAlert){
    $scope.success = "";
    $scope.listAdmin = "";
    $scope.errordetail = [];
    $scope.form_heading = 'Add Institute';
    $scope.whole_data = [];
    $scope.admin = {};
    var flag = '';
    if (typeof $route.current.$$route.flag !== 'undefined') {
        flag = $route.current.$$route.flag;
    }
    $scope.states = {};
    $scope.cities = {};
    //function getCities(){
    $scope.getCities = function(){
        if ($scope.states) {
            for(states_val in $scope.states){
                if($scope.states[states_val]._id == $scope.admin.state){
                    $scope.cities = $scope.states[states_val].cities;
                    break;
                } else {
                    $scope.cities = {};
                }
            }
        }
    }
    $scope.getStates = function(){
        State.listState().save({'is_active':1,'is_deleted':0}, function(data){
            $scope.errordetail = {};
            if (data) {
                var statesAr = {};
                $scope.states = data;
                if(typeof $scope.admin.state == 'undefined'){
                    for(state in $scope.states){
                        if($scope.states[state].state == 'CA'){
                            $scope.admin.state = $scope.states[state]._id;
                        }
                    }
                    $scope.getCities();
                } else {
                    $scope.getCities();
                }
            }
        });
    }
    $scope.add = function(){
        if ($scope.admin._id) {
            Admin.update().save($scope.admin, function(data){
                $scope.errordetail = {};
               if (data.success) {
                    Flash.create('success', 'Institute has been updated successfully.', 'alert alert-success');
                    $location.path('/listinstitute');
                } else {
                    if (data.error.errors){
                        $scope.errordetail = [];
                        for (var errName in data.error.errors) {
                            $scope.errordetail[errName] = data.error.errors[errName].message
                        }
                    } else{
                        $scope.errordetail[data.error.path] = data.error.message;
                        console.log($scope.error);
                    }
                }
            });
        } else {
            Admin.add().save($scope.admin, function(data){
               if (data.success) {
                    Flash.create('success', 'Institute has been saved successfully.', 'alert alert-success');
                    $location.path('/listinstitute');
                } else {
                    if (data.error.errors){
                         $scope.errordetail = [];
                        for (var errName in data.error.errors) {
                            $scope.errordetail[errName] = data.error.errors[errName].message
                        }
                    } else{
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
            $scope.getStates();
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
            Admin.update().save(update_object, function(data){
                if (data.success) {
                    $scope.tableParams.data[index].is_active = status;
                    Flash.create('success', 'Institute status has been updated successfully.', 'alert alert-success');
                }
            });
        });
    };
    $scope.deleteClinic = function(id) {
        SweetAlert.swal({
        title: "Are you sure?",
        text: "Your will not be able to recover institute !",
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
                    Flash.create('success', 'Institute has been deleted successfully.', 'alert alert-success');
                }
            }); 
        });
    };
    $scope.listAdmin = function(){
        Admin.list().query({}, function(data){
            $scope.whole_data = data;
            $scope.tableParams = new ngTableParams({count:25}, {counts:{}, data:$scope.whole_data});
        });
    }
    if (flag == "list") {
        $scope.listAdmin();
    } else if(flag == "add_admin"){
        $scope.getStates();
    } else if (flag == "edit_admin") {
        $scope.editAdmin();
    }
});