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
            $scope.tableParams = new ngTableParams({count:5}, {counts:{}, data:data});
        });
    }

    $scope.edit = function(){
        console.log($routeParams.id);
        Questions.getDetail().save({'_id':$routeParams.id}, function(data) {
            console.log(data);
            $scope.question = data;
            //$scope.tableParams = new ngTableParams({count:5}, {counts:{}, data:data});
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
            (typeof confirmAction != 'undefined')?confirmAction:"callFoo",
           $scope.confirmAction();
        });
        /*SweetAlert.swal({
           title: "Are you sure?",
           text: "Your will not be able to recover this imaginary file!",
           type: "warning",
           showCancelButton: true,
           confirmButtonColor: "#DD6B55",confirmButtonText: "Yes, delete it!",
           cancelButtonText: "No, cancel plx!",
           closeOnConfirm: false,
           closeOnCancel: false }, 
        function(isConfirm){ 
           if (isConfirm) {
              SweetAlert.swal("Deleted!", "Your imaginary file has been deleted.", "success");
           } else {
              SweetAlert.swal("Cancelled", "Your imaginary file is safe :)", "error");
           }
        });*/
    };

    if (flag == "list") {
        $scope.list();
    } else if (flag == "edit") {
        $scope.edit();
    } 
});