myapp.controller('dashboardCtrl', function($scope, $route, Alerts, $location, $rootScope, ngTableParams){
    $scope.error_message = "";
    var rec_cnt = 4;
    var flag = '';
    if (typeof $route.current.$$route.flag !== 'undefined') {
        flag = $route.current.$$route.flag;
    }
    $scope.alerts = function(){
    	Alerts.list().query({}, function(data){
            $scope.alerts = data;
           	$scope.total_alerts = $scope.alerts.length;
           	$scope.num_rows = 2;
           	$scope.num_cols = 4;
           	rec_cnt = $scope.num_rows*$scope.num_cols;
            $scope.tableParams = new ngTableParams({count:rec_cnt}, {counts:{}, data:$scope.alerts});
        });
    }
    if (flag == "listalerts") {
        $scope.alerts();
    } 
});