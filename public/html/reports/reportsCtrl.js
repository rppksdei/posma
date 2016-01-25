myapp.controller('reportsCtrl', function($scope, $route, Report, $location, Flash, ngTableParams, $rootScope, $routeParams, moment){
    $scope.error_message = "";
    var rec_cnt = 6;
    var flag = '';
    $scope.alerts = {};
    $scope.alert_data = {};
    if (typeof $route.current.$$route.flag !== 'undefined') {
        flag = $route.current.$$route.flag;
    }
    $scope.list = function(){
        Report.list().query({}, function(data){
            if(data){
                for (var k = 0; k < data.length; k++) {
                    if(typeof data[k].questionDetails != 'undefined') {
                        for(var i = 0; i < data[k].questionDetails.length; i++){
                            if(data[k].questionDetails[i].answer_type == 'rb' || 
                                data[k].questionDetails[i].answer_type == 'dd'){
                                for(var j = 0; j < data[k].questionDetails[i].answer.length; j++){
                                    var search = {};
                                    search.question = data[k].questionDetails[i]._id;
                                    search.ans = data[k].questionDetails[i].answer[j]._id;
                                    search.patient_answer = data[k]._id;
                                    Report.getalert().save({"search":search, 'i':i, 'j':j, 'k':k}, function(alertdata){
                                        data[alertdata.k].questionDetails[alertdata.i].answer[alertdata.j].is_noted = alertdata.data.is_noted;
                                        if(typeof alertdata.data.notes != 'undefined'){
                                            data[alertdata.k].questionDetails[alertdata.i].answer[alertdata.j].notes = alertdata.data.notes;
                                        } else {
                                            data[alertdata.k].questionDetails[alertdata.i].answer[alertdata.j].notes = '';
                                        }
                                    });
                                }
                            } else if(data[k].questionDetails[i].answer_type == 'cb'){
                                var anscntr = 0;
                                var anslength = data[k].questionDetails[i].answer.length;
                                var answerArr = new Array();
                                for(var j = 0; j < anslength; j++){
                                    var search = {};
                                    search.question = data[k].questionDetails[i]._id;
                                    answerArr[anscntr] = data[k].questionDetails[i].answer[j]._id;
                                    search.patient_answer = data[k]._id;
                                    anscntr++;
                                }
                                if(anscntr == anslength) {
                                    var next_i = i;
                                    var next_k = k;
                                    search.answer_opts = answerArr;
                                    Report.getalert().save({"search":search, 'i':i, 'j':j, 'k':k}, function(alertdata){
                                        data[alertdata.k].questionDetails[alertdata.i].is_noted = alertdata.data.is_noted;
                                        if(typeof alertdata.data.notes != 'undefined'){
                                            data[alertdata.k].questionDetails[alertdata.i].notes = alertdata.data.notes;
                                        } else {
                                            data[alertdata.k].questionDetails[alertdata.i].notes = '';
                                        }
                                    });
                                }
                            } else {
                            }
                        }
                    }
                }
            }
            $scope.alerts = data;
            $scope.tableParams = new ngTableParams({count:rec_cnt}, {counts:{}, data:$scope.alerts});
        });
    }
    if (flag == "report") {
        $scope.list();
    }
});