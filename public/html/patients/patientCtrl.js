myapp.controller('patientCtrl', function($scope, $route, Patient,Fitbit, Surgery, $location, Flash, $routeParams, ngTableParams, $rootScope, SweetAlert, moment){
    
    $scope.fitbit = {};
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
            for (var i = 0; i < data.length; i++) {
                if(typeof data[i].dos == 'number'){
                    $scope.patients[i].dos     = moment.unix(data[i].dos).format('MM/DD/YYYY');
                } else {
                    $scope.patients[i].dos = 'Invalid date';
                }
                if(typeof data[i].dohd == 'number'){
                    $scope.patients[i].dohd     = moment.unix(data[i].dohd).format('MM/DD/YYYY HH:mm:ss');
                } else {
                    $scope.patients[i].dohd = 'Invalid date';
                }
                //$scope.patients[i].dohd    = moment.unix(data[i].dohd).format('MM/DD/YYYY HH:mm:ss');
            }
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
    
    /** show HeartRate for today. **/
    $scope.showFitbitData = function(index) {
        var object_detail = $scope.tableParams.data[index];
        Fitbit.getFitbitData().query({'_id': object_detail._id}, function(data){
            console.log('data == ', data);
            
            if (typeof data[0] != 'undefined') {
                var hrText = '';
                hrText += "<table style='width:100%;border:1px solid #f3f3f3;'><tr><th style='text-align:center;border:1px solid #f3f3f3;'>Time range</th><th style='text-align:center;border:1px solid #f3f3f3;'>HR value(avg.)</th></tr>";
                for (var dat in data) {
                    //console.log('\ndat--', data[dat]);
                    if (! isNaN(dat)) {
                        hrText += '<tr><td style="border:1px solid #f3f3f3;">'+data[dat].start_time+' - '+data[dat].end_time+'</td><td style="border:1px solid #f3f3f3;">'+data[dat].avg_heart_rate+'</td></tr>';
                    }
                }
                hrText += "<tr><td colspan='2'><a href='/#/patients/history/"+data[0].patient+"' title='See HR history'>See HR history</a></td></tr></table>";
            
                SweetAlert.swal({
                    title: "Heart Rate for "+moment.unix(data[0].created).format('MM/DD/YYYY'),
                    text: hrText,
                    html: true,
                    allowEscapeKey : true, allowOutsideClick : true
                });
            }else{
                SweetAlert.swal({
                    title: "<medium>Oops! data not available. </medium>",
                    text: "Make sure you have clicked <strong>sync</strong> button earlier or the data might not be available at the moment.",
                    html: true,
                    type: "warning",
                    allowEscapeKey : true, allowOutsideClick : true
                });
            }
        });
    };
    
    
    /** show HeartRate History. **/
    $scope.getHRhistory = function(index) {
        swal.close();
        var patientId = $routeParams.id;
        Fitbit.getFitbitData().query({'_id': patientId,'is_date':0}, function(data){
            console.log('History data == <pre>', data);
            $scope.historyHR = data;
        });
    };
    
    
    /** show STEPS History. **/
    $scope.getStepsHistory = function(index) {
        swal.close();
        var patientId = $routeParams.id;
        Fitbit.getFitbitData().query({'_id': patientId,'is_steps':1}, function(data){
            console.log('Steps History data ==> ', data);
            $scope.historySteps = data;
        });
    };
    
    
    /** show Steps data for one week. **/
    $scope.showFitbitSteps = function(index) {
        var object_detail = $scope.tableParams.data[index];
        Fitbit.getFitbitSteps().query({'_id': object_detail._id}, function(data){
            console.log('Steps data == ', data);
            if (typeof data[0] != 'undefined') {
                var hrText = ''
                hrText += "<table style='width:100%;border:1px solid #f3f3f3;'><tr><th style='text-align:center;border:1px solid #f3f3f3;'>Date</th><th style='text-align:center;border:1px solid #f3f3f3;'>Steps</th></tr>";
                for (var dat in data) {
                    //console.log('\ndat--', data[dat]);
                    if (! isNaN(dat)) {
                        hrText += '<tr><td style="border:1px solid #f3f3f3;">'+data[dat].date+'</td><td style="border:1px solid #f3f3f3;">'+data[dat].steps+'</td></tr>';
                    }
                }
                hrText += "<tr><td colspan='2'><a href='/#/patients/history/steps/"+data[0].patient+"' title='See Steps history'>See Steps history</a></td></tr></table>";
                
                SweetAlert.swal({
                    title: "Steps <br/><small>"+data[0].start_from+" to "+data[0].end_date+"</small>",
                    text: hrText,
                    html: true,
                    allowEscapeKey : true, allowOutsideClick : true
                });
            }else{
                SweetAlert.swal({
                    title: "<medium>Oops! data not available. </medium>",
                    text: "Make sure you have clicked <strong>sync</strong> button earlier or the data might not be available at the moment.",
                    html: true,
                    type: "warning",
                    allowEscapeKey : true, allowOutsideClick : true
                });
            }
        });
    };
    
    if (flag == "list") {
        $scope.list();
    }else if (flag == "edit") {
        $scope.edit();
    }else if (flag == "add") {
        $scope.getAdd();
    }else if(flag == "historyHR"){
        $scope.getHRhistory();
    }else if(flag == "historySteps"){
        $scope.getStepsHistory();
    };
});
