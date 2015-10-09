myapp.controller('questionsCtrl', function($scope, $route, Questions,ngTableParams, $location, $rootScope){
    $scope.questionList = "";
    $scope.question = "";
    $scope.errors = [];
    var flag = '';
    
    if (typeof $route.current.$$route.flag !== 'undefined') {
        flag = $route.current.$$route.flag;
    }

    $scope.list = function(){
        Questions.getList().query({}, function(data) {
            $scope.tableParams = new ngTableParams({count:5}, {counts:{}, data:data});
        });
    }

    $scope.add = function(){
        var questiondata = $scope.question;
        var answer = [];
        if (!($scope.question.answer_type == "text" || $scope.question.answer_type == 'number')){
            console.log($scope.answer_opts.length);
            var answers = [];
            var i = 0;
            for(i; i < $scope.answer_opts.length; i++){
                answer[i] = $scope.answer_opts[i];
            }
            questiondata.answer = answer;
        }

        console.log(questiondata);
        Questions.addQuestion().save(questiondata, function(data){
            console.log(data);
            if (data.success) {
                $location.path('/questions');
            } else{
                console.log(data.error.errors);
                //console.log($scope.error);
            }
        });

    }

    $scope.answer_opts = [{id: 'ansopt1'}];

    $scope.addNewChoice = function() {
        var newItemNo = $scope.answer_opts.length+1;
        $scope.answer_opts.push({'id':'ansopt'+newItemNo});
    };
        
    $scope.removeChoice = function() {
        var lastItem = $scope.answer_opts.length-1;
        $scope.answer_opts.splice(lastItem);
    };
    
    if (flag == "list") {
        $scope.list();
    } 
});