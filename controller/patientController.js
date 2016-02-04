var patientModel = require("./../model/patientModel");
var moment = require('moment');
getlisting = function(req, res, next){
    var search_patient = {is_deleted:0};
    if (req.user.user_type == "2") {
        search_patient.clinic = req.user.parent_id;
    } else if (req.user.user_type == "0"){
        search_patient.clinic = req.user._id;
    }
    patientModel.getAllPatient(search_patient, function(err, patientDetail){
        if(err){
            res.json(err);
        } else{
            //console.log(patientDetail);
            res.json(patientDetail);
        }
    });
}
getPatientDetail = function(req, res){
    var patient_id = req.body.id;
    var search_patient  = {_id:patient_id};
    var fields          = req.body.field;
    patientModel.getPatient(search_patient, fields, function(err, data){
        var return_val = {};
        if (err){
            return_val.error = err;
            res.json(return_val);
        } else {
            if (data == null) {
                return_val.error = "Patient doesn't exists";
                res.json(return_val);
            } else{
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
        } else {
            if (data == null) {
                var return_val = {};
                return_val.success = true;
                callback(false, return_val);
            } else {
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
        } else {
            var return_val = {};
            if (data.success) {
                //add Admin cum clinic
                var patientDetail = req.body;
                patientDetail.created = moment().unix();
                //patientDetail.created = Date.now();
                patientDetail.clinic = req.user._id;
                //patientDetail.date_of_birth = dateToTimeStamp(req.body.date_of_birth);
                patientDetail.date_of_birth = moment(req.body.date_of_birth, 'MM/DD/YYYY').unix();
                patientDetail.dos = moment(req.body.dos, 'MM/DD/YYYY').unix();
                //patientDetail.dos = dateToTimeStamp(req.body.dos);
                //patientDetail.dohd = dateToTimeStamp(req.body.dohd);
                patientDetail.is_active = 1;
                //console.log(patientDetail);
                patientModel.addPatient(patientDetail, function(err, data){
                    if (err) {
                        if (err.errors) {
                            var error_detail = [];
                            for (var errName in err.errors) {
                                error_detail.push(err.errors[errName].message);
                            }
                            return_val.error = error_detail;
                            res.json(return_val);
                        } else {
                            return_val.error = err;
                            res.json(return_val);
                        }
                    } else {
                        return_val.success = "Patient has been added successfully.";
                        res.json(return_val);
                    }
                });
            } else {
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
    console.log('\nreq.body == \n', req.body);
    //console.log('date_of_birth = ',moment(req.body.date_of_birth, 'MM/DD/YYYY').unix());
    //Code to create JSON object data
    if(typeof req.body.post_patientData !== "undefined") {
        if(typeof req.body.post_patientData == "string") {
            req.body.post_patientData = JSON.parse(req.body.post_patientData);
            req.body._id = req.body.post_patientData._id;
            //req.body.date_of_birth = req.body.post_patientData.date_of_birth;
            req.body.gender = req.body.post_patientData.gender;
            req.body.first_name = req.body.post_patientData.first_name;
            req.body.last_name = req.body.post_patientData.last_name;
            req.body.email = req.body.post_patientData.email;
            req.body.mobile = req.body.post_patientData.mobile;
            req.body.address1 = req.body.post_patientData.address1;
            req.body.age = req.body.post_patientData.age;
            req.body.bmi = req.body.post_patientData.bmi;
            req.body.height = req.body.post_patientData.height;
            req.body.weight = req.body.post_patientData.weight;
        }
    }
    var update_data = {};
    if(typeof req.body.username != "undefined") {
        update_data.username = req.body.username;
    }
    if(typeof req.body.password != "undefined") {
        update_data.password = req.body.password;
    }
    if(typeof req.body.first_name != "undefined") {
        update_data.first_name = req.body.first_name;
    }
    if(typeof req.body.last_name != "undefined") {
        update_data.last_name = req.body.last_name;
    }
    if(typeof req.body.email != "undefined") {
        update_data.email = req.body.email;
    }

    if(typeof req.body.date_of_birth != "undefined"){
        //update_data.date_of_birth = dateToTimeStamp(req.body.date_of_birth);
        update_data.date_of_birth = moment(req.body.date_of_birth, 'MM/DD/YYYY').unix();
    }
    if(typeof req.body.dos != "undefined"){
        update_data.dos = moment(req.body.dos, 'MM/DD/YYYY').unix();
        //update_data.dos = dateToTimeStamp(req.body.dos);
    }
    if(typeof req.body.dohd != "undefined"){
        update_data.dohd = moment(req.body.dohd, 'MM/DD/YYYY').unix();
        //update_data.dohd = dateToTimeStamp(req.body.dohd);
    }
    if(typeof req.body.clinicalTstage != "undefined") {
        update_data.clinicalTstage = req.body.clinicalTstage;
    }
    if(typeof req.body.clinicalMstage != "undefined") {
        update_data.clinicalMstage = req.body.clinicalMstage;
    }
    if(typeof req.body.clinicalNstage != "undefined") {
        update_data.clinicalNstage = req.body.clinicalNstage;
    }
    if(typeof req.body.pathologicMstage != "undefined") {
        update_data.pathologicMstage = req.body.pathologicMstage;
    }
    if(typeof req.body.pathologicNstage != "undefined") {
        update_data.pathologicNstage = req.body.pathologicNstage;
    }
    if(typeof req.body.pathologicTstage != "undefined") {
        update_data.pathologicTstage = req.body.pathologicTstage;
    }
    if(typeof req.body.tumor_laterality != "undefined") {
        update_data.tumor_laterality = req.body.tumor_laterality;
    }
    if(typeof req.body.neoadjuvant_chemotherapy != "undefined") {
        update_data.neoadjuvant_chemotherapy = req.body.neoadjuvant_chemotherapy;
    }
    if(typeof req.body.size_of_tumor != "undefined") {
        update_data.size_of_tumor = req.body.size_of_tumor;
    }
    if(typeof req.body.address1 != "undefined") {
        update_data.address1 = req.body.address1;
    }
    if(typeof req.body.height != "undefined") {
        update_data.height = req.body.height;
    }
    if(typeof req.body.weight != "undefined") {
        update_data.weight = req.body.weight;
    }
    if(typeof req.body.age != "undefined") {
        update_data.age = req.body.age;
    }
    if(typeof req.body.gender != "undefined") {
        update_data.gender = req.body.gender;
    }
    if(typeof req.body.phone != "undefined") {
        update_data.phone = req.body.phone;
    }
    if(typeof req.body.mobile != "undefined") {
        update_data.mobile = req.body.mobile;
    }
    if(typeof req.body.surgery != "undefined") {
        update_data.surgery = req.body.surgery;
    }
    if(typeof req.body.clinic != "undefined") {
        update_data.clinic = req.body.clinic;
    }
    if(typeof req.body.pathway != "undefined") {
        update_data.pathway = req.body.pathway;
    }
    if(typeof req.body.is_deleted != "undefined") {
        update_data.is_deleted = req.body.is_deleted;
    }
    if(typeof req.body.is_active != "undefined") {
        update_data.is_active = req.body.is_active;
    }
    if(typeof req.body.cci != "undefined") {
        update_data.cci = req.body.cci;
    }
    if(typeof req.body.type_tumor != "undefined") {
        update_data.type_tumor = req.body.type_tumor;
    }
    if(typeof req.body.tnm != "undefined") {
        update_data.tnm = req.body.tnm;
    }
    if(typeof req.body.tmn != "undefined") {
        update_data.tmn = req.body.tmn;
    }
    if(typeof req.body.bmi != "undefined") {
        update_data.bmi = req.body.bmi;
    }
    if(typeof req.body.clavien_minor_no != "undefined") {
        update_data.clavien_minor_no = req.body.clavien_minor_no;
    }
    if(typeof req.body.clavien_major_no != "undefined") {
        update_data.clavien_major_no = req.body.clavien_major_no;
    }
    if(typeof req.body.sbl != "undefined") {
        update_data.sbl = req.body.sbl;
    }
    if(typeof req.body.degfr != "undefined") {
        update_data.degfr = req.body.degfr;
    }
    if(typeof req.body.discharge_hemoglobin != "undefined") {
        update_data.discharge_hemoglobin = req.body.discharge_hemoglobin;
    }
    if(typeof req.body.blood_transfusion != "undefined") {
        update_data.blood_transfusion = req.body.blood_transfusion;
    }
    if((typeof req.body.surgery != "undefined") && (typeof req.body.surgery._id != "undefined")) {
        update_data.surgery._id = req.body.surgery._id;
    }
    if((typeof req.body.pathway != "undefined") && (typeof req.body.pathway._id != "undefined")) {
        update_data.pathway._id = req.body.pathway._id;
    }
    if(typeof req.body.is_discharged != "undefined") {
        var d = new Date();
        update_data.dohd                = moment().unix();/*Date.now();*/
        update_data.time_of_discharge   = moment().unix();/*d.getTime();*/
    }
    if(typeof req.body.device_id != "undefined") {
        update_data.device_id = req.body.device_id;
    }
    if(typeof req.body.gmt != "undefined") {
        update_data.gmt = req.body.gmt;
    }
    

    update_data.modified = moment().unix();/*Date.now(); */
    //console.log('\n', moment().format('x')); // full 13 digits timestamp in ms
    //console.log('\n', moment().format('X')); // 10 digits timestamp in s
    //console.log('\n', moment().unix()); // 10 digits timestamp in s

    console.log('-----------',update_data);
    if(typeof req.body._id != "undefined"){
        var search_criteria = {_id:req.body._id};
        patientModel.updatePatient(search_criteria, update_data, function(err, data){
            var return_data = {};
            var message = "";
            //console.log(data);
            if (err) {
                if (err.errors) {
                    var error_detail = [];
                    for (var errName in err.errors) {
                        error_detail.push(err.errors[errName].message);
                    }
                    return_data.error = error_detail;
                    res.json(return_data);
                } else {
                    return_data.error = message;
                    res.json(return_data);
                }
            } else {
                return_data.success = "Details have been updated successfully.";
                return_data.update_data = update_data;
                res.json(return_data);
            }
        });
    } else {
        var return_data = {};
        return_data.error = "Please enter object id to update.";
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
