var questionnaireModel = require("./../model/questionnaireModel");
getlisting = function(req, res, next){
    var search = {is_deleted:0};
    var sort_order = {created: -1 };
    questionnaireModel.getAllQuestionnaire(search, sort_order, function(err, questionDetail){
        if(err){
            res.json(err);
        }
        else{
            res.json(questionDetail);
        }
    });
}

getQuestionnaireDetail = function(req, res){
    var questionnaier_id = req.body._id;
    var search_questionnaier = {_id:questionnaier_id};
    questionnaireModel.getQuestionnaire(search_questionnaier, function(err, data){
        var return_val = {};
        console.log(data);
        if (err){
            return_val.error = err;
            res.json(return_val);
        } else{
            if (data == null) {
                return_val.error = "Questionnaire doesn't exist.";
                res.json(return_val);
            }
            else{
                res.json(data);
            }
        }  
    });  
}

addQuestionnaire = function(req, res, next){
    var questionnaireDetail = req.body;
    questionnaireDetail.created = Date.now();
    questionnaireModel.addQuestionnaire(questionnaireDetail, function(err, data){
        var return_val = {};
        if (err) {
            var error_detail = [];
            for (var errName in err.errors) {
                error_detail.push(err.errors[errName].message);
            }
            return_val.error = error_detail;
            res.json(return_val);
        } else{
            return_val.success = "Questionnaire has been saved successfully.";
            res.json(return_val);
        }
    });
}

updateQuestionnaireDetail = function(req, res){
    //Code to create JSON object data
    var update_data = {};
    if(typeof req.body.name != "undefined"){
        update_data.name = req.body.name;
    }
    if(typeof req.body.type != "undefined"){
        update_data.type = req.body.type;
    }
    if(typeof req.body.question != "undefined"){
        update_data.question = req.body.question;
    }
    if(typeof req.body.execute_time != "undefined"){
        update_data.execute_time = req.body.execute_time;
    }
    if(typeof req.body.recur_type != "undefined"){
        update_data.recur_type = req.body.recur_type;
    }
    if(typeof req.body.daily_recurrence != "undefined"){
        update_data.daily_recurrence = req.body.daily_recurrence;
    }
    if(typeof req.body.time_slots != "undefined"){
        update_data.time_slots = req.body.time_slots;
    }
    if(typeof req.body.start_day != "undefined"){
        update_data.start_day = req.body.start_day;
    }
    if(typeof req.body.total_days != "undefined"){
        update_data.total_days = req.body.total_days;
    }
    if(typeof req.body.days != "undefined"){
        update_data.days = req.body.days;
    }
    if(typeof req.body.dates != "undefined"){
        update_data.dates = req.body.dates;
    }
    if(typeof req.body.is_deleted != "undefined"){
        update_data.is_deleted = req.body.is_deleted;
    }
    if(typeof req.body.is_active != "undefined"){
        update_data.is_active = req.body.is_active;
    }
    update_data.modified = Date.now();
    //End of code to create object data
    
    // Code to update clinic Details
    if(typeof req.body._id != "undefined"){
        var search_criteria = {};
        var search_criteria = {_id:req.body._id};
        //code
        questionnaireModel.updateQuestionnaire(search_criteria, update_data, function(err, data){
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
                return_data.success = "Questionnaire has been updated successfully.";
                res.json(return_data);
            }
        });
    }
    else{
        var return_data = {};
        return_data.error = "Please enter object id to update.";
        res.json(return_data);
    }
    //End of code to update clinic detail
}

module.exports = function(){
    this.getlisting = getlisting;
    this.getQuestionnaireDetail = getQuestionnaireDetail;
    this.addQuestionnaire = addQuestionnaire;
    this.updateQuestionnaireDetail = updateQuestionnaireDetail;
}