myapp.controller('fitbitCtrl', function($scope, $route, Fitbit, Patient, Surgery, $location, Flash, $routeParams, ngTableParams, $rootScope, SweetAlert, moment, $window){
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
    
    $scope.authorize = function(){
        $scope.error = [];
        var patientId = $routeParams.id;
        Fitbit.authorize().save({'id': patientId,'field':{'dohd':0,'time_of_discharge':0}}, function(data){
            console.log('data -- ', data);
            if(data){
                //window.location.href= data.uri; // opens in same window/tab.
                $window.open(data.uri, "_blank");
                /*
                Surgery.getDetail().query({}, function(sdata){
                    $scope.surgeries = sdata;
                    var surgery_id = $scope.patient.surgery._id;
                    Patient.getDetail().query({'surgery': surgery_id}, function(pdata){
                        $scope.pathways = pdata;
                    });
                });
                $scope.patient = data;
                */
            }
            $location.path('/patients');
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
      //console.log('>>> ', $scope.patient);
        var surgery_id = $scope.patient.surgery._id;
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
        //console.log('$scope.patient =============\n ',$scope.patient); return;
            Patient.addPatient().save(patientData, function(data){
            if(data.success){
                if($scope.patient._id){
                    Flash.create('success', 'Patient has been updated successfully.', 'alert alert-success');
                }else{
                    Flash.create('success', 'Patient has been added successfully.', 'alert alert-success');
                }
                $location.path('/patients');
            }else{
                console.log('Error Data = ', data);
                if (data.error.errors){
                    $scope.errordetail = [];
                    for (var errName in data.error.errors) {
                        $scope.errordetail[errName] = data.error.errors[errName].message;
                    }
                    //console.log($scope.errordetail);
                    Flash.create('danger', $scope.errordetail, 'alert alert-danger');
                }
                else{
                    //$scope.errordetail[data.error.path] = data.error.message;
                    Flash.create('danger', data.error, 'alert alert-danger');
                    $("html").scrollTop(0);
                }
            }
        });
    }
    
    $scope.edit = function(){
        $scope.error = [];
        var patientId = $routeParams.id;
        $scope.patient.neoadjuvant_chemotherapy = 'na';
        $scope.patient.tumor_laterality = 'na';
        Patient.getDetailId().save({'id': patientId,'field':{'dohd':0,'time_of_discharge':0}}, function(data){
            if(data){
                Surgery.getDetail().query({}, function(sdata){
                    $scope.surgeries = sdata;
                    var surgery_id = $scope.patient.surgery._id;
                    Patient.getDetail().query({'surgery': surgery_id}, function(pdata){
                        $scope.pathways = pdata;
                    });
                });
                $scope.patient = data;
                //console.log('dob = ', moment.unix(data.date_of_birth).format('MM/DD/YYYY'));
                //$scope.patient.date_of_birth    = $scope.timeStampToDate(data.date_of_birth);
                //$scope.patient.surgery          = $scope.patient.surgery._id;
                $scope.patient.date_of_birth    = moment.unix(data.date_of_birth).format('MM/DD/YYYY');
                $scope.patient.dos              = moment.unix(data.dos).format('MM/DD/YYYY');
                //$scope.patient.dohd             = moment.unix(data.dohd).format('MM/DD/YYYY');
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
        $scope.patient.age = $scope.getAgeFromDob(dob);
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
        $scope.patient.bmi = 0;
        if ($scope.patient.height != 'undefined' && $scope.patient.weight != 'undefined') {
            var height = $scope.patient.height;
            var weight = $scope.patient.weight;
            if (typeof height != 'undefined' && typeof weight != 'undefined'){
                //if (typeof height != 'undefined' && height.toString().length > 2 && height.toString().length < 4) {
                    $scope.patient.bmi = $scope.calculateBmi(height, weight);
                //}
            }
        }
        
        // var date = new Date(timeStamp);
        // var dateString = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear().toString();
        // return dateString;
    }

    $scope.calculateBmi = function(height, weight){        
        var finalBmi = 0;
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
        confirmButtonText: "Yes, discharge!",
        cancelButtonText: "No, need to confirm again!",
        closeOnConfirm: true}, 
        function(){
            var update_object = {'_id':object_detail._id, 'is_discharged':1};
            Patient.update().save(update_object, function(data){
                console.log(data);
                if (data.success) {
                    $scope.tableParams.data[index].dohd = moment.unix(data.update_data.dohd).format('MM/DD/YYYY HH:mm:ss');
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
    
    
    if (flag == "authorize") {
        $scope.authorize();
    }else if (flag == "edit") {
        $scope.edit();
    }else if (flag == "add") {
        $scope.getAdd();
    };
});
