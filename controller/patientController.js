var patientModel = require("./../model/patientModel");

getlisting = function(req, res, next){
    var search_patient = {is_deleted:0};
    if (req.user.user_type == "2") {
        search_patient.clinic = req.user.parent_id;
    }
    else if (req.user.user_type == "0"){
        search_patient.clinic = req.user._id;
    }
    patientModel.getAllPatient(search_patient, function(err, patientDetail){
        if(err){
            res.json(err);
        }
        else{
            //console.log(patientDetail);
            res.json(patientDetail);
        }
    });
}

getPatientDetail = function(req, res){
    var patient_id = req.params.id;
    var search_patient = {_id:patient_id};
    patientModel.getPatient(search_patient, function(err, data){
        var return_val = {};
        if (err){
            return_val.error = err;
            res.json(return_val);
        }
        else{
            if (data == null) {
                return_val.error = "Patient doesn't exists";
                res.json(return_val);
            }
            else{
                res.json(data);
            }
        }  
    });  
}

isUsernameExists = function(username, callback){
    var search_criteria = {};
    search_criteria.username = username;
    patientModel.getPatient(search_criteria, function(err, data){
        var return_val = {};
        if (err){
            callback(err, false);
        }
        else{
            if (data == null) {
                var return_val = {};
                return_val.success = true;
                callback(false, return_val);
            }
            else{
                var return_val = {};
                return_val.error = "Username already exists";
                callback(false, return_val);
            }
        }  
    });  
    
}

addPatient = function(req, res, next){
    var username = req.body.username;
    isUsernameExists(username, function(err, data){
        if (err) {
            res.json(err);
        }
        else{
            if (data.success) {
                //add Admin cum clinic
                var patientDetail = req.body;
                patientDetail.created = Date.now();
                patientDetail.clinic  = req.user._id;
                patientDetail.date_of_birth     = dateToTimeStamp(req.body.date_of_birth);
                patientDetail.dos               = dateToTimeStamp(req.body.dos);
                patientDetail.dohd              = dateToTimeStamp(req.body.dohd);
                console.log(patientDetail);
                patientModel.addPatient(patientDetail, function(err, data){
                    var return_val = {};
                    if (err) {
                        return_val.error = err;
                        res.json(return_val);
                    }
                    else{
                        return_val.success = "Patient added Successfully";
                        res.json(return_val);
                    }
                });
            }
            else{
                var return_val = {'error':data.error};
                res.json(return_val);
            }
        }
    });
}

dateToTimeStamp = function(myDate){
    myDate = myDate.split("/");
    var newDate = myDate[0]+"/"+myDate[1]+"/"+myDate[2];
    var dateTimeStamp = new Date(newDate).getTime();
    return dateTimeStamp;
}

updatePatientDetail = function(req, res){

    //Code to create JSON object data
    var update_data = {};
    if(typeof req.body.username != "undefined"){
        update_data.username = req.body.username;
    }
    if(typeof req.body.password != "undefined"){
        update_data.password = req.body.password;
    }
    if(typeof req.body.first_name != "undefined"){
        update_data.first_name = req.body.first_name;
    }
    if(typeof req.body.last_name != "undefined"){
        update_data.last_name = req.body.last_name;
    }
    if(typeof req.body.email != "undefined"){
        update_data.email = req.body.email;
    }
    if(typeof req.body.date_of_birth != "undefined"){
        update_data.date_of_birth = req.body.date_of_birth;
    }
    if(typeof req.body.address1 != "undefined"){
        update_data.address1 = req.body.address1;
    }
    if(typeof req.body.address2 != "undefined"){
        update_data.address2 = req.body.address2;
    }
    if(typeof req.body.phone != "undefined"){
        update_data.phone = req.body.phone;
    }
    if(typeof req.body.mobile != "undefined"){
        update_data.mobile = req.body.mobile;
    }
    if(typeof req.body.surgery != "undefined"){
        update_data.surgery = req.body.surgery;
    }
    if(typeof req.body.clinic != "undefined"){
        update_data.clinic = req.body.clinic;
    }
    if(typeof req.body.pathway != "undefined"){
        update_data.pathway = req.body.pathway;
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
    if(typeof req.body.patient_id != "undefined"){
        var search_criteria = {_id:req.body.patient_id};
        patientModel.updatePatient(search_criteria, update_data, function(err, data){
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
                return_data.success = "Patient updated Successfully";
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
    this.getPatientDetail = getPatientDetail;
    this.addPatient = addPatient;
    this.updatePatientDetail = updatePatientDetail;
}

