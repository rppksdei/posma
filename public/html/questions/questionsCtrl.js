myapp.controller('questionsCtrl', function($scope, $route, Questions,ngTableParams,
                                myService,SweetAlert, $http, $location, $rootScope,$routeParams){
    $scope.questionList = "";
    $scope.question = "";
    $scope.errors = [];
    var flag = '';
    
    if (typeof $route.current.$$route.flag !== 'undefined') {
        flag = $route.current.$$route.flag;
    }



    $scope.list = function(){
        Questions.getList().query({}, function(data) {
            $scope.tableParams = new ngTableParams({count:10}, {counts:{}, data:data});
        });
    }

    $scope.answer_opts = [{id: 'ansopt1'}];

    $scope.edit = function(){
        if(!$scope.question){
            Questions.getDetail().save({'_id':$routeParams.id}, function(data) {
                $scope.question = data;
                //if($scope.question.answer){
                console.log($scope.question.answer);
                if(!($scope.question.answer_type == "text" || $scope.question.answer_type == 'number')){
                    $scope.answer_opts = $scope.question.answer;
                } else {

                }
                //}
            });
        } else {
            var questiondata = $scope.question;
            var answer = [];
            console.log(questiondata.answer_opts);
            if (!($scope.question.answer_type == "text" || $scope.question.answer_type == 'number')){
                var answers = [];
                var i = 0;
                for(i; i < $scope.answer_opts.length; i++){
                    answer[i] = $scope.answer_opts[i];
                }
                questiondata.answer = answer;

                questiondata.min_range = '';
                questiondata.max_range = '';
                questiondata.max_length = '';
            } else {
                var lastItem = $scope.answer_opts.length-1;
                $scope.answer_opts.splice(lastItem);
            }
            console.log(questiondata.answer);
            Questions.updateQuestion().save(questiondata, function(data){
                if (data.success) {
                    $location.path('/questions');
                } else{
                    console.log(data.error.errors);
                    //console.log($scope.error);
                }
            });
        }
    }

    $scope.add = function(){
        var questiondata = $scope.question;
        var answer = [];
        if (!($scope.question.answer_type == "text" || $scope.question.answer_type == 'number')){
            var answers = [];
            var i = 0;
            for(i; i < $scope.answer_opts.length; i++){
                answer[i] = $scope.answer_opts[i];
            }
            questiondata.answer = answer;
        }
        Questions.addQuestion().save(questiondata, function(data){
            if (data.success) {
                $location.path('/questions');
            } else{
                console.log(data.error.errors);
                //console.log($scope.error);
            }
        });

    }

    $scope.addNewChoice = function() {
        var newItemNo = $scope.answer_opts.length+1;
        $scope.answer_opts.push({'id':'ansopt'+newItemNo});
    };
        
    $scope.removeChoice = function() {
        var lastItem = $scope.answer_opts.length-1;
        $scope.answer_opts.splice(lastItem);
    };
    
    $scope.callFoo = function() {
        console.log('here');
        myService.foo();
    }

    $scope.getTopMatch = function(title,message,type,confirmButText,cancelButText,confirmAction,recId) {
        SweetAlert.swal({
        title: (typeof title != 'undefined')?title:"Are you sure?",
        text: (typeof message != 'undefined')?message:"Your will not be able to recover this imaginary file!",
        type: (typeof type != 'undefined')?type:"warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: (typeof confirmButText != 'undefined')?confirmButText:"Yes, delete it!",
        cancelButtonText: (typeof cancelButText != 'undefined')?cancelButText:"No, cancel plx!",
        closeOnConfirm: false}, 
        function(){
            if(confirmAction == 'delete'){
                $scope.removeChoice();
            } else if(confirmAction == 'status'){
                $scope.changeStatus();
            }
           // (typeof confirmAction != 'undefined')?confirmAction:"callFoo",
           //$scope.confirmAction();
        });
    };

    if (flag == "list") {
        $scope.list();
    } else if (flag == "edit") {
        $scope.edit();
    } 
});