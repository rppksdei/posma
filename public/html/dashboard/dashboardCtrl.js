myapp.controller('dashboardCtrl', function($scope, $route, Alerts, $location, Flash, ngTableParams, $rootScope, $routeParams, moment, SweetAlert){
    $scope.error_message = "";
    var rec_cnt = 6;
    var flag = '';
    $scope.alerts = {};
    $scope.alert_data = {};
    if (typeof $route.current.$$route.flag !== 'undefined') {
        flag = $route.current.$$route.flag;
    }

    $scope.alerts = function(){
        Alerts.list().query({}, function(data){
            console.log("dfsdfdf");
            //console.log('--------------here1',data);
            $scope.alerts = data;
            for (var i = 0; i < data.length; i++) {
                $scope.alerts[i].datetime    = moment.unix(data[i].datetime).format('MM/DD/YYYY HH:mm:ss');
            }
            $scope.tableParams = new ngTableParams({count:rec_cnt}, {counts:{}, data:$scope.alerts});
        });
    }

    $scope.detail = function(){
        $scope.heading = 'Alert Details';
        $scope.alertId = $routeParams.id;
        $scope.alert = {};
        Alerts.getDetail().save({'id':$scope.alertId}, function(data){
            $scope.alert = data;
            $scope.alert_data.notes = $scope.alert.notes;
        });
    }

    $scope.add = function(){
        $scope.alert_data._id = $scope.alert._id
        Alerts.addNote().save($scope.alert_data, function(data){
           if (data.success) {
                Flash.create('success', 'Note has been saved successfully.', 'alert alert-success');
                $location.path('/');
            } else{
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
    
    /** Dismiss Alert. **/
    $scope.dismiss = function(index) {
        var object_detail = $scope.tableParams.data[index];
    console.log('--object_detail--', object_detail);
        SweetAlert.swal({
            title: "Are you sure?",
            text: "You want to dismiss '"+object_detail.ques_name+"' alert.",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes",
            cancelButtonText: "No",
            closeOnConfirm: true
        }, 
        function(){
            var status = 0;
            if (object_detail.is_dismissed == 0) {
                status = 1;
            }
            var update_object = {'_id':object_detail._id, 'is_dismissed':1};
            Alerts.update().save(update_object, function(data){
                console.log('--data--',data);
                if (data.success) {
                    console.log('\n in success...');
                    //$scope.tableParams.data[index].is_dismissed = status;
                    Flash.create('success', 'Alert updated successfully.', 'alert alert-success');
                    //$location.path('/');
                    $route.reload();
                    console.log('\n after----');
                }
            });
        });
    }

    if (flag == "listalerts") {
        $scope.alerts();
    } else if (flag == "alert_detail") {
        $scope.detail();
    }

});