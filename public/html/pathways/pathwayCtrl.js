myapp.controller('pathwayCtrl', function($scope, $route, Pathway, Surgery, Questionnaire, $location, Flash, $routeParams, ngTableParams, $rootScope, SweetAlert){
    $scope.pathways = [];
    $scope.success = "";
    $scope.pathway = "";
    $scope.errordetail = [];
    // Initialize variable
    $scope.assign = {};
    //$scope.questionnaires = [];
    
    var flag = '';
    if (typeof $route.current.$$route.flag !== 'undefined') {
        flag = $route.current.$$route.flag;
    }
    $scope.list = function(){
        Pathway.getList().query({}, function(data){
            console.log(data);
            $scope.pathways = data;
            $scope.tableParams = new ngTableParams({count:5}, {counts:{}, data:$scope.pathways});
        });    
    }

    /* function to get surgeries & pathways on add form */
    $scope.getAdd = function(){
        Surgery.getDetail().query({}, function(data){
            $scope.surgeries = data;
        });
        var pathwayId = $routeParams.id;
        Pathway.getDetailId().save({'id': pathwayId}, function(pdata){
            $scope.assign = pdata;
        });
        Questionnaire.list().query({}, function(data){
            $scope.questionnaires = data;
        });
    }

    $scope.getPathways = function(){
        var surgery_id = $scope.pathway.surgery;
        Pathway.getDetail().query({'surgery': surgery_id}, function(data){
            $scope.pathways = data;
        });
    }

    /* function to add/save new pathway */
    $scope.add = function(){
        var pathwayData = $scope.pathway;
        console.log(pathwayData);
        
        Pathway.addPathway().save(pathwayData, function(data){
            if(data.success){
                if($scope.pathway._id){
                    Flash.create('success', 'pathway has been updated successfully.', 'alert alert-success');
                }else{
                    Flash.create('success', 'pathway has been added successfully.', 'alert alert-success');
                }
                $location.path('/pathways');
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
        var pathwayId = $routeParams.id;
        Surgery.getDetail().query({}, function(data){
            $scope.surgeries = data;
        });
        Pathway.getDetailId().save({'id': pathwayId}, function(data){
            if(data){
                $scope.pathway = data;           
            }
        });
        Questionnaire.list().query({}, function(data){
            $scope.questionnaires = data;
        });
    }

    /*
    $scope.assignquestionnaires = function(){
        var pathwayId = $routeParams.id;
    console.log(pathwayId);
        Pathway.getDetailId().save({'id': pathwayId}, function(pdata){
    console.log(pdata);
            //$scope.pathway = pdata;
            $scope.assign = pdata;
        });
        Questionnaire.list().query({}, function(data){
            $scope.questionnaires = data;
            //console.log($scope.questionnaires);
        });
    }

    $scope.savequestionnaires = function(){
        var qData = $scope.assign.questionnaire;
        var pathwayId = $routeParams.id;
        Pathway.update().save({'_id': pathwayId, 'questionnaire': qData}, function(data){
            if(data.success){
                Flash.create('success', 'Questionnaires assigned successfully to Pathway.', 'alert alert-success');
                $location.path('/pathways');
            }
        });
    }
    */

    $scope.timeStampToDate = function(timeStamp){
        var date = new Date(timeStamp);
        var dateString = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear().toString();
        return dateString;
    }
    
    $scope.deletepathway = function(id) {
        SweetAlert.swal({
        title: "Are you sure?",
        text: "You will not be able to recover pathway!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel it!",
        closeOnConfirm: true}, 
        function(){
            var update_object = {'_id':id, 'is_deleted':1};
            Pathway.update().save(update_object, function(data){
                if (data.success) {
                    var del_index = 0;
                    for(i=0;(i < $scope.pathways.length); i++){
                        if($scope.pathways[i]._id == id){
                            del_index = i;
                            break;
                        }
                    }
                    $scope.pathways.splice(del_index, 1);
                    $scope.tableParams = new ngTableParams({count:5}, {counts:{}, data:$scope.pathways});
                    Flash.create('success', 'pathway has been deleted successfully.', 'alert alert-success');
                }
            }); 
        });
    };

    $scope.changepathwayStatus = function(index) {
        var object_detail = $scope.tableParams.data[index];
        //console.log(object_detail);
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
            Pathway.update().save(update_object, function(data){
                if (data.success) {
                    $scope.tableParams.data[index].is_active = status;
                    Flash.create('success', 'pathway status has been updated successfully.', 'alert alert-success');
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
    }else if (flag == "assign") {
        $scope.assignquestionnaires();
    };
});