var patientModel = require("./../model/patientModel");

getlisting = function(req, res, next){
    var search = {is_deleted:0};
    if (req.user.user_type == "2") {
        search.clinic = req.user.parent_id;
    }else if (req.user.user_type == "0"){
        search.clinic = req.user._id;
    }
    var time_val = req.body.time_val;
    search.time_of_discharge = time_val;
    patientModel.getAllPatient(search, function(err, patientDetail){
        if(err){
            res.json(err);
        }
        else{
            res.json(patientDetail);
        }
    });
}

getpatientDetail = function(req, res){
    var pathway_id = req.body.id;
    var search_pathway = {_id:pathway_id};
    //console.log(req);
    patientModel.getPathway(search_pathway, function(err, data){
        var return_val = {};
        if (err){
            return_val.error = err;
            res.json(return_val);
        }
        else{
            if (data == null) {
                return_val.error = "Pathway doesn't exists";
                res.json(return_val);
            }
            else{
                res.json(data);
            }
        }  
    });  
}

addPathway = function(req, res, next){
    var patientDetail = req.body;
    patientDetail.created       = Date.now();
    patientDetail.is_active     = 1;
    patientDetail.clinic        = req.user._id;
    patientModel.addPathway(patientDetail, function(err, data){
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
            return_val.success = "Pathway added Successfully";
            res.json(return_val);
        }
      //  res.json(return_val);
    });
}

updatepatientDetail = function(req, res){
    //Code to create JSON object data
    var update_data = {};
    //console.log(req.body);
    if(typeof req.body.name != "undefined"){
        update_data.name = req.body.name;
    }
    if(typeof req.body.description != "undefined"){
        update_data.description = req.body.description;
    }
    if(typeof req.body.surgery != "undefined"){
        update_data.surgery = req.body.surgery;
    }
    if(typeof req.body.clinic != "undefined"){
        update_data.clinic = req.body.clinic;
    }
    if(typeof req.body.questionnaire != "undefined"){
        update_data.questionnaire = req.body.questionnaire;
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
        patientModel.updatePathway(search_criteria, update_data, function(err, data){
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
                return_data.success = "Pathway updated Successfully";
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
    this.getpatientDetail = getpatientDetail;
    this.addPathway = addPathway;
    this.updatepatientDetail = updatepatientDetail;
}

