myapp.controller('patientCtrl', function($scope, $route, Patient, $location, Flash, $routeParams, ngTableParams, $rootScope, SweetAlert){
    $scope.patients = [];
    $scope.success = "";
    $scope.patient = "";
    $scope.errordetail = [];

    /* 720kb date picker settings */
        $scope.pattern = 'MM/dd/yyyy';
        $scope.date_min = '01/01/1900';
        $scope.dob_date_max = new Date();
        $scope.default_date = new Date();
    
    var flag = '';
    if (typeof $route.current.$$route.flag !== 'undefined') {
        flag = $route.current.$$route.flag;
    }
    $scope.list = function(){
        Patient.getList().query({}, function(data){
            $scope.patients = data;
            $scope.tableParams = new ngTableParams({count:5}, {counts:{}, data:$scope.patients});
        });    
    }

    /* function to get surgeries & pathways on add form */
    $scope.getAdd = function(){
        Patient.getAddDetails.save({}, function(data){
            if(data){
                console.log(data);
            }
        });
    }

    /* function to add/save new patient */
    $scope.add = function(){
        var patientData = $scope.patient;
        Patient.addPatient().save(patientData, function(data){
            if(data.success){
                if($scope.patient._id){
                    Flash.create('success', 'Patient has been updated successfully.', 'alert alert-success');
                }else{
                    Flash.create('success', 'Patient has been added successfully.', 'alert alert-success');
                }
                $location.path('/patients');
            }else{
                if (data.error.errors){
                     $scope.errordetail = [];
                    for (var errName in data.error.errors) {
                        $scope.errordetail[errName] = data.error.errors[errName].message
                    }
                     console.log($scope.errordetail);
                }
                else{
                    $scope.errordetail[data.error.path] = data.error.message;
                    console.log($scope.errordetail);
                }
            }
        });
        
    }

    $scope.edit = function(){
        $scope.error = [];
        var surgeryId = $routeParams.id;
        Patient.getDetailId().save({'id': surgeryId}, function(data){
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
    
    $scope.deleteSurgery = function(id) {
        SweetAlert.swal({
        title: "Are you sure?",
        text: "You will not be able to recover surgery!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel it!",
        closeOnConfirm: true}, 
        function(){
            var update_object = {'_id':id, 'is_deleted':1};
            Patient.update().save(update_object, function(data){
                if (data.success) {
                    var del_index = 0;
                    for(i=0;(i < $scope.patients.length); i++){
                        if($scope.patients[i]._id == id){
                            del_index = i;
                            break;
                        }
                    }
                    $scope.patients.splice(del_index, 1);
                    $scope.tableParams = new ngTableParams({count:5}, {counts:{}, data:$scope.patients});
                    Flash.create('success', 'Patient has been deleted successfully.', 'alert alert-success');
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
            //console.log(update_object);
            Patient.update().save(update_object, function(data){
                if (data.success) {
                    $scope.tableParams.data[index].is_active = status;
                    Flash.create('success', 'Patient status has been updated successfully.', 'alert alert-success');
                }
            });
        });
    };
    
    if (flag == "list") {
        $scope.list();
    }else if (flag == "edit") {
        $scope.edit();
    }else if (flag == "add") {
        $scope.getAdd();
    };
});