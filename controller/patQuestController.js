var patQuestModel = require("./../model/patientQuestionnaireModel");

getlisting = function(req, res, next){
    var search = {is_deleted:0};
    patQuestModel.getAllQuestionnaire(search, function(err, userDetail){
        if(err){
            res.json(err);
        }
        else{
            res.json(userDetail);
        }
    });
}

getQuestionnaireDetail = function(req, res){
    var questionnaire_id = req.params.id;
    var search_questionnaire = {_id:questionnaire_id};
    patQuestModel.getQuestionnaire(search_questionnaire, function(err, data){
        var return_val = {};
        if (err){
            return_val.error = err;
            res.json(return_val);
        }
        else{
            if (data == null) {
                return_val.error = "Questionnaire doesn't exists";
                res.json(return_val);
            }
            else{
                res.json(data);
            }
        }  
    });  
}

addQuestionnaire = function(req, res){
    var questionnaireDetail = req.body;
    questionnaireDetail.created = Date.now();
    patQuestModel.addQuestionnaire(questionnaireDetail, function(err, data){
        var return_val = {};
        if (err) {
            var error_detail = [];
            // go through all the errors...
            for (var errName in err.errors) {
                error_detail.push(err.errors[errName].message);
            }
            return_val.error = error_detail;
            res.json(return_val);
        }
        else{
            return_val.success = "Questionnaire assigned Successfully";
            res.json(return_val);
        }
      //  res.json(return_val);
    });
}

updateQuestionnaireDetail = function(req, res){

    //Code to create JSON object data
    var update_data = {};
    if(typeof req.body.patient != "undefined"){
        update_data.patient = req.body.patient;
    }
    if(typeof req.body.questionnaire_id != "undefined"){
        update_data.questionnaire_id = req.body.questionnaire_id;
    }
    if(typeof req.body.surgery != "undefined"){
        update_data.surgery = req.body.surgery;
    }
    if(typeof req.body.pathway != "undefined"){
        update_data.pathway = req.body.pathway;
    }
    if(typeof req.body.clinic != "undefined"){
        update_data.clinic = req.body.clinic;
    }
    if(typeof req.body.is_deleted != "undefined"){
        update_data.is_deleted = req.body.is_deleted;
    }
    if(typeof req.body.is_active != "undefined"){
        update_data.is_active = req.body.is_active;
    }
    if(typeof req.body.status != "undefined"){
        update_data.status = req.body.status;
    }
    if(typeof req.body.sent_on != "undefined"){
        update_data.sent_on = req.body.sent_on;
    }
    update_data.modified = Date.now();
    //End of code to create object data
    
    // Code to update clinic Details
    if(typeof req.body.patient_questionnaire_id != "undefined"){
        var search_criteria = {};
        var search_criteria = {_id:req.body.patient_questionnaire_id};
        //code
        patQuestModel.updateQuestionnaire(search_criteria, update_data, function(err, data){
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
                return_data.success = "Questionnaire updated Successfully";
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
    this.getQuestionnaireDetail = getQuestionnaireDetail;
    this.addQuestionnaire = addQuestionnaire;
    this.updateQuestionnaireDetail = updateQuestionnaireDetail;
}

