var surgeryModel = require("./../model/surgeryModel");

getlisting = function(req, res, next){
    search_surgery = {is_deleted:0};
    if(typeof req.query.conditions != 'undefined'){
        search_surgery = JSON.parse(req.query.conditions);
    }
    if (req.user.user_type == "2") {
        search_surgery.clinic = req.user.parent_id;
    } else if (req.user.user_type == "0"){
        search_surgery.clinic = req.user._id;
    }
    surgeryModel.getAllSurgery(search_surgery, function(err, userDetail){
        if(err){
            res.json(err);
        }
        else{
            //console.log(req.user);
            
            res.json(userDetail);
        }
    });
}

getSurgeryDetail = function(req, res){
    var surgery_id = req.body.id;
    var search_surgery = {_id:surgery_id};
    surgeryModel.getSurgery(search_surgery, function(err, data){
        var return_val = {};
        //console.log(err);
        // console.log(data);
        if (err){
            return_val.error = err;
            res.json(return_val);
        }else{
            if (data == null) {
                return_val.error = "surgery doesn't exists";
                res.json(return_val);
            }
            else{
                res.json(data);
            }
        }
    });  
}

addSurgery = function(req, res){
    var surgeryDetail = req.body;
    surgeryDetail.created   = Date.now();
    surgeryDetail.clinic    = req.user._id;
    surgeryModel.addSurgery(surgeryDetail, function(err, data){
        var return_val = {};
        if (err) {
            return_val.error = err;
            res.json(return_val);
        }
        else{
            return_val.success = "Surgery added Successfully";
            res.json(return_val);
        }
    });
}

updateSurgeryDetail = function(req, res){
    //Code to create JSON object data
    var update_data = {};
    if(typeof req.body.clinic_id != "undefined"){
        update_data.clinic_id = req.body.clinic_id;
    }
    if(typeof req.body.name != "undefined"){
        update_data.name = req.body.name;
    }
    if(typeof req.body.description != "undefined"){
        update_data.description = req.body.description;
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
        surgeryModel.updateSurgery(search_criteria, update_data, function(err, data){
            var return_data = {};
            var message = "";
            if (err) {
                return_val.error = err;
                res.json(return_val);
            }
            else{
                return_data.success = "Surgery updated Successfully";
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

/*
getSurgeryByClinic = function(req, res){
    var search_criteria = {is_deleted:0};
    if (req.user.user_type == "2") {
        search_criteria.clinic = req.user.parent_id;
    }else if (req.user.user_type == "0"){
        search_criteria.clinic = req.user._id;
    }
    surgeryModel.getSurgeryByClinic(search_criteria, function(err, surgeryDetail){
        if(err){
            res.json(err);
        }
        else{
            console.log(patientDetail);
            res.json(surgeryDetail);
        }
    });
}
*/

module.exports = function(){
    this.getlisting = getlisting;
    this.getSurgeryDetail = getSurgeryDetail;
    this.addSurgery = addSurgery;
    this.updateSurgeryDetail = updateSurgeryDetail;
}

