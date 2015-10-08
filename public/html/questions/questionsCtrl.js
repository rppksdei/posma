myapp.controller('questionsCtrl', function($scope, $route, Questions, $location, $rootScope){
    $scope.questionList = "";
    $scope.question = "";
    var flag = '';
    
    if (typeof $route.current.$$route.flag !== 'undefined') {
        flag = $route.current.$$route.flag;
    }

    $scope.list = function(){
        Questions.getList().query({}, function(data){
            $scope.profileData = data;
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
            if (data.success) {
                //$rootScope.user = $scope.profileData;
                //$scope.success_message = data.success;
            } else{
                //$scope.error[data.error.path] = data.error.message;
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
        $scope.getList();
    } else if (flag == "add") {
        $scope.add();
    }
});