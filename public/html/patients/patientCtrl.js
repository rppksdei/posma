myapp.controller('patientCtrl', function($scope, $route, Patient, Surgery, $location, Flash, $routeParams, ngTableParams, $rootScope, SweetAlert){
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
        Surgery.getDetail().query({}, function(data){
            $scope.patient.gender = 'M';
            $scope.patient.neoadjuvant_chemotherapy = 'na';
            $scope.patient.tumor_laterality = 'na';
            $scope.surgeries = data;
        });
    }
    $scope.getPathways = function(){
        var surgery_id = $scope.patient.surgery;
        // console.log(surgery_id);
        if(typeof surgery_id != 'undefined'){
            Patient.getDetail().query({'surgery': surgery_id}, function(data){
                $scope.pathways = data;
            });
        }else{
            $scope.pathways = '';
        }
    }
    $scope.getQuestionnaires = function(){
        console.log($scope.patient);
        var pathway_id = $scope.patient.pathway;
        if(typeof pathway_id != 'undefined'){
            Patient.getDetail().query({'surgery': pathway_id}, function(data){
                $scope.pathways = data;
            });
        }else{
            $scope.pathways = '';
        }
        
    }
    /* function to add/save new patient */
    $scope.add = function(){
        var patientData = $scope.patient;
            console.log(patientData);
        Patient.addPatient().save(patientData, function(data){
            console.log(data);
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
                        $scope.errordetail[errName] = data.error.errors[errName].message;
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
        var patientId = $routeParams.id;
        $scope.patient.neoadjuvant_chemotherapy = 'na';
        $scope.patient.tumor_laterality = 'na';
        Patient.getDetailId().save({'id': patientId}, function(data){
            if(data){
                Surgery.getDetail().query({}, function(sdata){
                    $scope.surgeries = sdata;
                    var surgery_id = $scope.patient.surgery._id;
                    Patient.getDetail().query({'surgery': surgery_id}, function(pdata){
                        $scope.pathways = pdata;
                        // console.log(pdata); console.log($scope.patient);
                    });
                });

                $scope.patient = data;
                $scope.patient.date_of_birth    = $scope.timeStampToDate(data.date_of_birth);
                $scope.patient.dos              = $scope.timeStampToDate(data.dos);
                $scope.patient.dohd             = $scope.timeStampToDate(data.dohd);
                //$scope.patient.surgery          = $scope.patient.surgery._id;
                
            }
        });
    }
    $scope.timeStampToDate = function(timeStamp){
        var date = new Date(timeStamp);
        var dateString = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear().toString();
        return dateString;
    }
    $scope.getAge = function(){
        var dob = $scope.patient.date_of_birth;
        // console.log(dob);
        $scope.patient.age = $scope.getAgeFromDob(dob);
        // console.log($scope.patient);
        // var date = new Date(timeStamp);
        // var dateString = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear().toString();
        // return dateString;
    }

    $scope.getAgeFromDob = function (dateString) {
        var today = new Date();
        var birthDate = new Date(dateString);
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }

    $scope.getBMI = function(){
        var height = $scope.patient.height;
        var weight = $scope.patient.weight;
        //console.log(dob);
        $scope.patient.bmi = $scope.calculateBmi(height, weight);
        //console.log($scope.patient);
        // var date = new Date(timeStamp);
        // var dateString = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear().toString();
        // return dateString;
    }

    $scope.calculateBmi = function(height, weight){        
        var finalBmi = '';
        if(weight > 0 && height > 0){   
            finalBmi = weight/(height/100*height/100);
        }
        return finalBmi.toFixed(2);
    }
    
    $scope.deletePatient = function(id) {
        SweetAlert.swal({
        title: "Are you sure?",
        text: "You will not be able to recover patient!",
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

    $scope.dischargePatient = function(index) {
        var object_detail = $scope.tableParams.data[index];
        SweetAlert.swal({
        title: "Are you sure?",
        text: "You are going to discharge patient! Date and time will be saved automatically.",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, change it!",
        cancelButtonText: "No, cancel it!",
        closeOnConfirm: true}, 
        function(){
            var update_object = {'_id':object_detail._id, 'is_discharged':1};
            Patient.update().save(update_object, function(data){
                console.log(data);
                if (data.success) {
                    $scope.tableParams.data[index].dohd = data.update_data.dohd;
                    //$scope.tableParams = new ngTableParams({count:5}, {counts:{}, data:$scope.patients});
                    Flash.create('success', 'Patient discharged status has been changed successfully.', 'alert alert-success');
                }
            }); 
        });
    };

    $scope.changePatientStatus = function(index) {
        var object_detail = $scope.tableParams.data[index];
        //console.log(object_detail);
        SweetAlert.swal({
        title: "Are you sure?",
        text: "you want to change status of "+object_detail.username+" ",
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