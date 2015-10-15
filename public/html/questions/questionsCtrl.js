myapp.controller('questionsCtrl', function($scope, $route, Questions,ngTableParams,
                                myService,orderByFilter,SweetAlert, $http, $location, $rootScope,$routeParams){
    $scope.questionList = "";
    $scope.question = "";
    $scope.errors = [];
    $scope.questions = [];
    $scope.selected_questions = [];
    $scope.Sorted = [];
    var flag = '';
    var enabled = false;
    
    if (typeof $route.current.$$route.flag !== 'undefined') {
        flag = $route.current.$$route.flag;
    }



    $scope.list = function(){
        Questions.getList().query({}, function(data) {
            $scope.tableParams = new ngTableParams({count:10}, {counts:{}, data:data});
        });
    }

    $scope.dd = function(){
        var accordionPane = 'header-1';

        if(typeof($routeParams.accordionPane) !== 'undefined') {
            accordionPane = $routeParams.accordionPane;
        }

        $rootScope.$broadcast('expand', accordionPane);

        $rootScope.$on('angular-accordion-expand', function(event, eventArguments) {
            $location.path(eventArguments);
        });   


        $scope.questions = [
            {
                'id':'1',
                'name':'Ques1',
                'ans':[
                    {'name':'A1','out_of_range':'0'},
                    {'name':'A2','out_of_range':'0'},
                    {'name':'A3','out_of_range':'1'}
                ]
            },
            {
                'id':'2',
                'name':'Ques2',
                'ans':[
                    {'name':'A11','out_of_range':'0'},
                    {'name':'A12','out_of_range':'0'},
                    {'name':'A13','out_of_range':'1'}
                ]
            },
            {
                'id':'3',
                'name':'Ques3',
                'ans':[]
            }
        ];
        $scope.selected_questions = [];
        $scope.queOrder = [];
        for(var i=0; i< $scope.questions.length; i++){
            $scope.questions[i].order = i;
            $scope.queOrder[i] = i;
        }
        //$scope.queOrder = $scope.questions;
        //console.log($scope.queOrder);

        //$scope.arrVal = ['one','two','three','four','five','six'];
        //$scope.arrVal = $scope.arrVal.sort();
        //console.log($scope.questions);



        $scope.example1model = [];
        $scope.example1data = [
            {id: 1, label: "David"},
            {id: 2, label: "Jhon"},
            {id: 3, label: "Danny"}];

        $scope.example2model = [];
        $scope.example2data = [
            {id: 1, label: "David"},
            {id: 2, label: "Jhon"},
            {id: 3, label: "Danny"}];
        $scope.example2settings = {displayProp: 'id'};

        $scope.example3model = [];
        $scope.example3data = [
            {id: 1, label: "David"},
            {id: 2, label: "Jhon"},
            {id: 3, label: "Danny"},
            {id: 4, label: "Danny"}];
        $scope.example3settings = {displayProp: 'label', idProp: 'label'};


        $scope.example4model = [];
        $scope.example4data = [
            {id: 1, label: "David"},
            {id: 2, label: "Jhon"},
            {id: 3, label: "Danny"}];
        $scope.example4settings = {displayProp: 'label', idProp: 'id', externalIdProp: 'myCustomPropertyForTheObject'};


        $scope.example5model = [];
        $scope.example5data = [
            {id: 1, label: "David"},
            {id: 2, label: "Jhon"},
            {id: 3, label: "Danny"}];
        $scope.example5settings = {};
        $scope.example5customTexts = {buttonDefaultText: 'Select Users'};


        $scope.example6model = [{id: 1}, {id: 3}];
        $scope.example6data = [
            {id: 1, label: "David"},
            {id: 2, label: "Jhon"},
            {id: 3, label: "Danny"}];
        $scope.example6settings = {};


        $scope.example7model = [];
        $scope.example7data = [
            {id: 1, label: "David"},
            {id: 2, label: "Jhon"},
            {id: 3, label: "Danny"}];
        $scope.example7settings = {externalIdProp: ''};


        $scope.example8model = [];
        $scope.example8data = [
            {id: 1, label: "David"},
            {id: 2, label: "Jhon"},
            {id: 3, label: "Danny"}];


        $scope.example9model = [];
        $scope.example9data = [
            {id: 1, label: "David"},
            {id: 2, label: "Jhon"},
            {id: 3, label: "Danny"}];
        $scope.example9settings = {enableSearch: true};

        $scope.example10model = [];
        $scope.example10data = [
            {id: 1, label: "David"},
            {id: 2, label: "Jhon"},
            {id: 3, label: "Danny"}];
        $scope.example10settings = {selectionLimit: 2};


        $scope.example11model = [];
        $scope.example11data = [
            {id: 1, label: "David", gender: 'M'},
            {id: 2, label: "Jhon", gender: 'M'},
            {id: 3, label: "Lisa", gender: 'F'},
            {id: 4, label: "Nicole", gender: 'F'},
            {id: 5, label: "Danny", gender: 'M'}];
        $scope.example11settings = {
            groupByTextProvider: function(groupValue)
            {
                if (groupValue === 'M')
                {
                    return 'Male';
                }
                else
                {
                    return 'Female';
                }
            }
        };


        $scope.example12model = {};
        $scope.example12data = [
            {id: 1, label: "David"},
            {id: 2, label: "Jhon"},
            {id: 3, label: "Danny"}];
        $scope.example12settings = {selectionLimit: 1};

        $scope.example13model = [];
        $scope.example13data = [
            {id: 1, label: "David"},
            {id: 2, label: "Jhon"},
            {id: 3, label: "Lisa"},
            {id: 4, label: "Nicole"},
            {id: 5, label: "Danny"}];
        $scope.example13settings = {
            smartButtonMaxItems: 3,
            smartButtonTextConverter: function(itemText, originalItem) {
                if (itemText === 'Jhon') {
                    return 'Jhonny!';
                }
                return itemText;
            }
        };

        $scope.example14model = [];
        $scope.example14data = [
            {id: 1, label: "David"},
            {id: 2, label: "Jhon"},
            {id: 3, label: "Lisa"},
            {id: 4, label: "Nicole"},
            {id: 5, label: "Danny"},
            {id: 6, label: "Dan"},
            {id: 7, label: "Dean"},
            {id: 8, label: "Adam"},
            {id: 9, label: "Uri"},
            {id: 10, label: "Phil"}];
        $scope.example14settings = {
            scrollableHeight: '100px',
            scrollable: true
        };

        $scope.example15model = [];
        $scope.example15data = [
            {id: 1, label: "David"},
            {id: 2, label: "Jhon"},
            {id: 3, label: "Lisa"},
            {id: 4, label: "Nicole"},
            {id: 5, label: "Danny"}];

        $scope.example15settings = {
            enableSearch: true
        };

        $scope.customFilter = 'a';

    }

    $scope.selectQuestion = function(qindex){
        $scope.selected_questions.push($scope.questions[qindex]);
        $scope.questions.splice(qindex,1);
    };
    $scope.unselectQuestion = function(qindex){
        $scope.questions.push($scope.selected_questions[qindex]);
        $scope.Sorted = orderByFilter($scope.questions, function(item) {
            return $scope.queOrder.indexOf(item.order);
        });
        $scope.questions = $scope.Sorted;
        $scope.selected_questions.splice(qindex,1); 
    };

    /*$scope.paneEnabled = function() {
        return enabled;
    };

    $scope.enablePane = function() {
        enabled = !enabled;
    }*/

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
    }  else if (flag == "dd") {
        $scope.dd();
    } 
});