myapp.controller('questionnaireCtrl', function($scope, $route, Questionnaire, Questions, myService, $http, $location ,Flash, orderByFilter, ngTableParams, $rootScope, $routeParams, SweetAlert){
    $scope.success = "";
    $scope.ass_quqes = {};
    $scope.listAdmin = "";
    $scope.errordetail = [];
    $scope.form_heading = 'Add Questionnaire';
    $scope.sel_days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
    var flag = '';
    $scope.questionnair_ques = [];
    $scope.selected_questions = [];
    $scope.selected_ques={};
    $scope.queOrder = [];
    $scope.questionnaire = '';
    $scope.ques_quesnaire = '';
    $scope.questionnaires = {};
    $scope.TimeDropdownmodel = [];
    var rec_cnt = 10;
    $scope.questionnaire.recur_type = 'd';
    if (typeof $route.current.$$route.flag !== 'undefined') {
        flag = $route.current.$$route.flag;
    }
    /*code to make time dropdown*/
    $scope.dropDownTimeArr = new Array();
    $p = 0;
    for($i=1;$i<24;$i++){
        $j=0;
        while($j<59){
            $scope.dropDownTimeArr[$p] = {};
            $scope.dropDownTimeArr[$p].id = $i+":"+$j;
            $scope.dropDownTimeArr[$p].label = ($i>9?""+$i:"0"+$i)+":"+($j>9?""+$j:"0"+$j);
            $p++;
            $j += 2;
        }
    }
    $scope.selectedTime = [];
    $scope.TimeDropdownTexts = {buttonDefaultText: 'Select time slots'};
    $scope.TimeDropdownsettings = {
        scrollableHeight: '200px',
        scrollable: true, 
        smartButtonMaxItems: 6,
        displayProp: 'label', 
        idProp: 'label',
        externalIdProp: 'time_slot',
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
            time_slots.push($scope.selectedTime[i].time_slot);
        }
        $scope.questionnaire.time_slots = time_slots;
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
    }
    $scope.edit = function(){
        var time_slots = [];
        if(!$scope.questionnaire){
            Questionnaire.getDetail().save({'_id':$routeParams.id}, function(data) {
                $scope.questionnaire = data;
                for(var ts = 0; ts < $scope.questionnaire.time_slots.length; ts++){
                    $scope.selectedTime[ts] = {time_slot:$scope.questionnaire.time_slots[ts]};
                }
                
            });
        } else {
            for(i=0;i<$scope.selectedTime.length;i++){
                time_slots.push($scope.selectedTime[i].time_slot);
            }
            $scope.questionnaire.time_slots = time_slots;
            var questionnairedata = $scope.questionnaire;
            Questionnaire.update().save(questionnairedata, function(data){
                if (data.success) {
                    Flash.create('success', 'Questionnaire has been updated successfully.', 'alert alert-success');
                    $location.path('/questionnaires');
                } else{
                    console.log(data.error.errors);
                }
            });
        }
    }
    $scope.assign_questions = function(){
        $scope.ass_ques_criteria = {};
        if(!$scope.ques_quesnaire){
            Questionnaire.getDetail().save({'_id':$routeParams.id}, function(data) {
                $scope.ques_quesnaire = data;

                console.log($scope.ques_quesnaire.question);
                if($scope.ques_quesnaire.question){
                    for(var k=0; k< $scope.ques_quesnaire.question.length; k++){
                        $scope.selected_questions[k] = $scope.ques_quesnaire.question[k];
                    }
                }
                if($scope.ques_quesnaire.question.length != 0){
                    $scope.ass_quqes.search_cre = {'is_deleted':0,_id: {$nin: $scope.ques_quesnaire.question}};
                    //$scope.selected_ques.search_cre = {_id: {$in: $scope.ques_quesnaire.question}};
                    //$scope.selected_ques.sort_order = '-';
                } else {
                    $scope.ass_quqes.search_cre = {'is_deleted':0};
                }
                Questions.getList().query($scope.ass_quqes, function(quesArr) {
                    $scope.questionnair_ques = quesArr;
                    /*for(var i=0; i< $scope.questionnair_ques.length; i++){
                        $scope.questionnair_ques[i].order = i;
                        $scope.queOrder[i] = i;
                    }*/
                });
                /*if($scope.selected_ques.search_cre){
                    Questions.getList().query($scope.selected_ques, function(quesArr) {
                        $scope.selected_questions = quesArr;
                    });
                }*/
            });
        } else { 
            var questionnairedata = {};
            questionnairedata._id = $routeParams.id;
            var cnt = 0;
            var selected_ques = [];
            for(cnt; cnt < $scope.selected_questions.length; cnt++){
                console.log($scope.selected_questions[cnt]._id);
                selected_ques[cnt] = $scope.selected_questions[cnt]._id;
            }
            console.log($scope.selected_questions);
            questionnairedata.selected_questions = selected_ques;
            Questionnaire.update().save(questionnairedata, function(data){
                if (data.success) {
                    Flash.create('success', 'Questions have been assigned to questionnaire successfully.', 'alert alert-success');
                    $location.path('/questionnaires');
                } else{
                    console.log(data.error.errors);
                }
            });
        }
    }
    //$scope.selectQuestion = function(qindex){
    $scope.selectQuestion = function(ques_id){
        //$scope.selected_questions.push($scope.questionnair_ques[qindex]);
        //$scope.questionnair_ques.splice(qindex,1);
        var qq = 0;
        for(qq; qq < $scope.questionnair_ques.length; qq++){
            if($scope.questionnair_ques[qq]._id == ques_id){
                $scope.selected_questions.push($scope.questionnair_ques[qq]);
                $scope.questionnair_ques.splice(qq,1);
            }
        }
    };
    $scope.unselectQuestion = function(qindex){
        $scope.questionnair_ques.push($scope.selected_questions[qindex]);
        /*$scope.Sorted = orderByFilter($scope.questionnair_ques, function(item) {
            return $scope.queOrder.indexOf(item.order);
        });*/
       // $scope.questionnair_ques = $scope.Sorted;
        $scope.selected_questions.splice(qindex,1); 
    };
    $scope.onDrop = function($event,$data,index){
        var current_position;
        console.log($scope.selected_questions);
        for(var sq = 0; sq < $scope.selected_questions.length; sq++){
            if($scope.selected_questions[sq]._id == $data._id){
                current_position = sq;
            }
        }
        if(current_position < index){
            for (var i = current_position; i <= index; i++){
                if(i == index){
                    $scope.selected_questions[i] = $data;
                } else {
                    $scope.selected_questions[i] = $scope.selected_questions[i+1]; 
                }
            }
        }
        if(current_position > index){
            for (var i = current_position; i >= index ; i--){
                if(i == index){
                    $scope.selected_questions[i] = $data;
                } else {
                    $scope.selected_questions[i] = $scope.selected_questions[i-1]; 
                }
            }
        }
        console.log($scope.selected_questions);
    };
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
        text: "Are you sure you want to "+newStatus+" '"+object_detail.name+"'?",
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
        text: "Are you sure you want to delete '"+qname+"'?",
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
    } else if (flag == "edit") {
        $scope.edit();
    } else if(flag == "assign_ques"){
        $scope.assign_questions();
    }
});
