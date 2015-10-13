var questionModel = require("./../model/questionModel");

getlisting = function(req, res, next){
    var search = {is_deleted:0};
    questionModel.getAllQuestion(search, function(err, questionDetail){
        if(err){
            res.json(err);
        }
        else{
            res.json(questionDetail);
        }
    });
}

getQuestionDetail = function(req, res){
    var question_id = req.body._id;
    var search_question = {_id:question_id};
    questionModel.getQuestion(search_question, function(err, data){
        var return_val = {};
        if (err){
            return_val.error = err;
            res.json(return_val);
        }
        else{
            if (data == null) {
                return_val.error = "Question doesn't exist.";
                res.json(return_val);
            }
            else{
                res.json(data);
            }
        }  
    });  
}
/*
 need input in following manner
{
    "name":"New Test Question ?",
    "answer":[
                {"name":"option1", "out_of_range":"0"},
                {"name":"option2", "out_of_range":"0"},
                {"name":"option3", "out_of_range":"1" ......}
            ],
    ...     :  ...
}
*/
addQuestion = function(req, res, next){
    var questionDetail = req.body;
    console.log(questionDetail);
    questionDetail.created = Date.now();
    questionModel.addQuestion(questionDetail, function(err, data){
        var return_val = {};
        if (err) {
            var error_detail = [];
            // go through all the errors...
            console.log(err);
            for (var errName in err.errors) {
                error_detail.push(err.errors[errName].message);
            }
            return_val.error = error_detail;
            res.json(return_val);
        }
        else{
            return_val.success = "Question has been added successfully.";
            res.json(return_val);
        }
      //  res.json(return_val);
    });
}

updateQuestionDetail = function(req, res){

    //Code to create JSON object data
    var update_data = {};
    if(typeof req.body.name != "undefined"){
        update_data.name = req.body.name;
    }
    if(typeof req.body.answer_type != "undefined"){
        update_data.answer_type = req.body.answer_type;
    }
    if(typeof req.body.min_range != "undefined"){
        update_data.min_range = req.body.min_range;
    }
    if(typeof req.body.max_range != "undefined"){
        update_data.max_range = req.body.max_range;
    }
    if(typeof req.body.max_length != "undefined"){
        update_data.max_length = req.body.max_length;
    }
    if(typeof req.body.gender != "undefined"){
        update_data.gender = req.body.gender;
    }
    if(typeof req.body.answer != "undefined"){
        update_data.answer = req.body.answer;
    }
    if(typeof req.body.is_deleted != "undefined"){
        update_data.is_deleted = req.body.is_deleted;
    }
    update_data.modified = Date.now();
    //End of code to create object data
    
    // Code to update clinic Details
    if(typeof req.body.question_id != "undefined"){
        var search_criteria = {};
        var search_criteria = {_id:req.body.question_id};
        //code
        questionModel.updateQuestion(search_criteria, update_data, function(err, data){
            var return_data = {};
            var message = "";
            if (err) {
                if (err.errors) {
                    var error_detail = [];
                    for (var errName in err.errors) {
                        error_detail.push(err.errors[errName].message);
                    }
                    return_data.error = error_detail;
                    res.json(return_data);
                }
                else{
                    return_data.error = message;
                    res.json(return_data);
                }
            }
            else{
                return_data.success = "Question updated Successfully";
                res.json(return_data);
            }
        });
    }
    else{
        var return_data = {};
        return_data.error = "Please enter object id to update";
        res.json(return_data);
    }
    //End of code to update clinic detail
}



module.exports = function(){
    this.getlisting = getlisting;
    this.getQuestionDetail = getQuestionDetail;
    this.addQuestion = addQuestion;
    this.updateQuestionDetail = updateQuestionDetail;
}

