var adminModel = require("./../model/adminModel");

getlisting = function(req, res, next){
    var search = {is_deleted:0};
    adminModel.getAllAdmin(search, function(err, adminDetail){
        if(err){
            res.json(err);
        }
        else{
            res.json(adminDetail);
        }
    });
}

getAdminDetail = function(req, res){
    var admin_id = req.params.id;
    var search_admin = {_id:admin_id};
    adminModel.getAdmin(search_admin, function(err, data){
        var return_val = {};
        if (err){
            return_val.error = err;
            res.json(return_val);
        }
        else{
            if (data == null) {
                return_val.error = "admin doesn't exists";
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
    adminModel.getAdmin(search_criteria, function(err, data){
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

addAdmin = function(req, res, next){
    var username = req.body.username;
    isUsernameExists(username, function(err, data){
        if (err) {
            res.json(err);
        }
        else{
            if (data.success) {
                //add Admin cum clinic
                var adminDetail = req.body;
                adminDetail.created = Date.now();
                adminModel.addAdmin(adminDetail, function(err, data){
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
                        return_val.success = "Clinic added Successfully";
                        res.json(return_val);
                    }
                  //  res.json(return_val);
                });
            }
            else{
                var return_val = {'error':data.error};
                res.json(return_val);
            }
        }
    });
}

updateAdminDetail = function(req, res){

    //Code to create JSON object data
    var update_data = {};
    if(typeof req.body.username != "undefined"){
        update_data.username = req.body.username;
    }
    if(typeof req.body.password != "undefined"){
        update_data.password = req.body.password;
    }
    if(typeof req.body.clinic_name != "undefined"){
        update_data.clinic_name = req.body.clinic_name;
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
    if(typeof req.body.phone != "undefined"){
        update_data.phone = req.body.phone;
    }
    if(typeof req.body.user_type != "undefined"){
        update_data.user_type = req.body.user_type;
    }
    if(typeof req.body.mobile != "undefined"){
        update_data.mobile = req.body.mobile;
    }
    if(typeof req.body.address1 != "undefined"){
        update_data.address1 = req.body.address1;
    }
    if(typeof req.body.address2 != "undefined"){
        update_data.address2 = req.body.address2;
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
    if(typeof req.body.admin_id != "undefined"){
        var search_criteria = {_id:req.body.admin_id};
        adminModel.updateAdmin(search_criteria, update_data, function(err, data){
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
                return_data.success = "Clinic updated Successfully";
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
    this.getAdminDetail = getAdminDetail;
    this.addAdmin = addAdmin;
    this.updateAdminDetail = updateAdminDetail;
}

