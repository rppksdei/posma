myapp.controller('questionnaireCtrl', function($scope, $route, Questionnaire, $location,Flash, ngTableParams, $rootScope, $routeParams, SweetAlert){
    $scope.success = "";
    $scope.listAdmin = "";
    $scope.errordetail = [];
    $scope.form_heading = 'Add Questionnaire';
    $scope.sel_days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
    $scope.whole_data = [];
    var flag = '';
    $scope.questionnaire = '';
    $scope.questionnaires = {};
    $scope.TimeDropdownmodel = [];
    var rec_cnt = 10;

    //$scope.questionnaire.type = 'single';
    if (typeof $route.current.$$route.flag !== 'undefined') {
        flag = $route.current.$$route.flag;
    }
    
    /*code to make time dropdown*/
    $scope.dropDownTimeArr = new Array();
    $p = 0;
    for($i=5;$i<24;$i++){
        $j=0;
        while($j<59){
            $scope.dropDownTimeArr[$p] = {};
            $scope.dropDownTimeArr[$p].id = $i+":"+$j;
            $scope.dropDownTimeArr[$p].label = ($i>9?""+$i:"0"+$i)+":"+($j>9?""+$j:"0"+$j);
            $p++;
            $j += 30;
        }
    }
    $scope.selectedTime = [];
    $scope.TimeDropdownTexts = {buttonDefaultText: 'Select time slots'};
    $scope.TimeDropdownsettings = {
        scrollableHeight: '200px',
        scrollable: true, 
        smartButtonMaxItems: 6,
        smartButtonTextConverter: function(itemText, originalItem) {
            return itemText;
        }
    };
    /*End of code */
    $scope.selectedSingleTime = [];
    //End of code to make time dropdown
    
    $scope.add = function(){
        var time_slots = [];
        for(i=0;i<$scope.selectedTime.length;i++){
            time_slots.push($scope.selectedTime[i].id);
        }
        $scope.questionnaire.time_slots = time_slots;
        /* if ($scope.questionnaire._id) {
            Questionnaire.update().save($scope.questionnaire, function(data){
                $scope.errordetail = {};
               if (data.success) {
                    Flash.create('success', 'Questionnaire has been updated successfully.', 'alert alert-success');
                    $location.path('/listquestionnaires');
                } else {
                    if (data.error.errors){
                        $scope.errordetail = [];
                        for (var errName in data.error.errors) {
                            $scope.errordetail[errName] = data.error.errors[errName].message
                        }
                    } else {
                       $scope.errordetail[data.error.path] = data.error.message;
                    }
                }
            });
        } else{*/
        Questionnaire.add().save($scope.questionnaire, function(data){
           if (data.success) {
                Flash.create('success', 'Questionnaire has been saved successfully.', 'alert alert-success');
                $location.path('/questionnaires');
            } else{
                if (data.error.errors){
                    $scope.errordetail = [];
                    for (var errName in data.error.errors) {
                        $scope.errordetail[errName] = data.error.errors[errName].message
                    }
                } else{
                   $scope.errordetail[data.error.path] = data.error.message;
                }
            }
        });
        /*}  */
    }
    
    /*$scope.edit = function(){
        $scope.form_heading = 'Update Institute';
        $scope.editProfileId = $routeParams.id;
        $scope.admin = {};
        Admin.getDetail().save({'id':$scope.editProfileId}, function(data){
            $scope.admin = data;
        });
    }*/
    

    $scope.edit = function(){
        if(!$scope.questionnaire){
            Questionnaire.getDetail().save({'_id':$routeParams.id}, function(data) {
                $scope.questionnaire = data;
                for(var ts = 0; ts < $scope.questionnaire.time_slots.length; ts++){
                    $scope.TimeDropdownmodel[ts] = {id:$scope.questionnaire.time_slots[ts]};
                }
                //$scope.TimeDropdownmodel = [{id: 1}, {id: 3}];
                $scope.selectedTime = $scope.TimeDropdownmodel;
                //$scope.questionnaireRecOpts = {recur_type : data.recur_type};
            });
        } else {
            var questionnairedata = $scope.questionnaire;
            Questionnaire.update().save(questionnairedata, function(data){
                if (data.success) {
                    Flash.create('success', 'Questionnaire has been updated successfully.', 'alert alert-success');
                    $location.path('/questionnaire');
                } else{
                    console.log(data.error.errors);
                }
            });
        }
    }
    
    $scope.changeStatus = function(index, existingStatus) {
        var newStatus = 'inactivate';
        var newStatus_title = 'inactivataed';

        if(existingStatus == 0){
            newStatus = 'activate';
            newStatus_title = 'activataed';
        }

        var object_detail = $scope.tableParams.data[index];
        SweetAlert.swal({
        title: "Confirmation",
        text: "Are you sure you want to "+newStatus+" "+object_detail.name+"?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        closeOnConfirm: true},

        function(){ 
            var status = 0;
            if (object_detail.is_active == 0) {
                status = 1;
            }
            var update_object = {'_id':object_detail._id, 'is_active':status};
            Questionnaire.update().save(update_object, function(data){
                if (data.success) {
                    $scope.tableParams.data[index].is_active = status;
                    Flash.create('success', 'Questionnaire has been '+newStatus_title+' successfully.', 'alert alert-success');
                }
            });
        });
    };

    
    $scope.deleteQuestionnaire = function(id,qname) {
        SweetAlert.swal({
        title: "Confirmation",
        text: "Are you sure you want to delete "+qname+"?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes",
        cancelButtonText: "No!",
        closeOnConfirm: true}, 
        function(){ 
            var update_object = {'_id':id, 'is_deleted':1};
            Questionnaire.update().save(update_object, function(data){
                if (data.success) {
                    var del_index = 0;
                    for(i=0;(i < $scope.questionnaires.length); i++){
                        if($scope.questionnaires[i]._id == id){
                            del_index = i;
                            break;
                        }
                    }
                    $scope.questionnaires.splice(del_index, 1);
                    $scope.tableParams = new ngTableParams({count:rec_cnt}, {counts:{}, data:$scope.questionnaires});
                    Flash.create('success', 'Questionnaire has been deleted successfully.', 'alert alert-success');
                }
            }); 
        });
    };
   
    $scope.listQuestionnaire = function(){
        Questionnaire.list().query({}, function(data){
            $scope.questionnaires = data;
            $scope.tableParams = new ngTableParams({count:rec_cnt}, {counts:{}, data:$scope.questionnaires});
        });
    }
    
    if (flag == "list") {
        $scope.listQuestionnaire();
    }
    else if (flag == "edit") {
        $scope.edit();
    }
});