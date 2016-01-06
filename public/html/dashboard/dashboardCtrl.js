myapp.controller('dashboardCtrl', function($scope, $route, Alerts, $location, $rootScope, ngTableParams,moment){
    $scope.error_message = "";
    var rec_cnt = 6;
    var flag = '';
    if (typeof $route.current.$$route.flag !== 'undefined') {
        flag = $route.current.$$route.flag;
    }
    $scope.alerts = function(){
    	Alerts.list().query({}, function(data){
            $scope.alerts = data;
            for (var i = 0; i < data.length; i++) {
                $scope.alerts[i].datetime    = moment.unix(data[i].datetime).format('MM/DD/YYYY HH:mm:ss');
            }
            $scope.tableParams = new ngTableParams({count:rec_cnt}, {counts:{}, data:$scope.alerts});
        });
    }
    if (flag == "listalerts") {
        $scope.alerts();
    } 
});