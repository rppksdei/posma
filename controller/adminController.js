var adminModel = require("./../model/adminModel");
var common = require('./../common.js');

getlisting = function(req, res, next){
    var search = {is_deleted:0};
    if (req.user.user_type == "1") {
        search.user_type = 0;
    } else if (req.user.user_type == "0"){
        search.user_type = 2;
        search.parent_id = req.user._id;
    }
    if(typeof req.query.conditions != 'undefined'){
        search = JSON.parse(req.query.conditions);
        console.log('---',search);
    }
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
    var admin_id = req.body.id;
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
                data.password = common.decrypt(data.password);
                res.json(data);
            }
        }  
    });  
}

isAdminExists = function(username, callback){
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
                return_val.error = {};
                return_val.error.path = "username";
                return_val.error.message = "Username already exists";
                callback(return_val, false);
            }
        }  
    });  
    
}

addAdmin = function(req, res, emailService, next){
    var username = req.body.username;
    isAdminExists(username, function(err, data){
        if (err) {
            res.json(err);
        }
        else{
            if (data.success) {
                //add Admin cum clinic
                var adminDetail = req.body;
                adminDetail.created = Date.now();
                if (req.user.user_type == "1") {
                    adminDetail.user_type = 0;
                } else if (req.user.user_type == "0"){
                    adminDetail.user_type = 2;
                    adminDetail.parent_id = req.user._id;
                    adminDetail.clinic_name = "";
                }
                /* Email data  */
                var userDetails = {};
                userDetails.email = adminDetail.email;
                userDetails.username = adminDetail.username;
                userDetails.pass = adminDetail.password;
                userDetails.firstname = adminDetail.first_name;

                adminDetail.password = common.encrypt(adminDetail.password);
                adminModel.addAdmin(adminDetail, function(err, data){
                    var return_data = {};
                    if (err) {
                        return_data.error = err;
                        res.json(return_data);
                    } else{
                        return_data.success = true;
                        var frm = 'Ramanpreet ✔ <raman411@gmail.com>';
                        var emailSubject = 'Welcom to Post Operative System Management';
                        var emailTemplate = 'registration.html';
                        emailService.send(userDetails,emailSubject,emailTemplate,frm);
                        res.json(return_data);
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

updateAdminDetail = function(req, res, emailService){
    var send_email = 0;
    var new_password = '';
    //Code to create JSON object data
    var update_data = {};
    if(typeof req.body.username != "undefined"){
        update_data.username = req.body.username;
    }
    if(typeof req.body.password != "undefined"){
        new_password = req.body.password;
        update_data.password = common.encrypt(req.body.password);
        send_email = 1;
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
        send_email = 1;
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
    if(typeof req.body.surgery != "undefined"){
        update_data.surgery = req.body.surgery;
    }
    if(typeof req.body.is_active != "undefined"){
        update_data.is_active = req.body.is_active;
    }
    update_data.modified = Date.now();
    //End of code to create object data
    if(send_email == 1){
        var userDetails = {};
        var emailTemplate = 'update_details.html';
        var emailSubject = 'Updated Post Operative System Management Account Details';
        userDetails.email = req.body.email;
        userDetails.username = req.body.username;
        userDetails.pass = new_password;
        userDetails.firstname = req.body.first_name;
        var frm = 'Ramanpreet ✔ <raman411@gmail.com>';
    }
    
    // Code to update clinic Details
    if(typeof req.body._id != "undefined"){
        var search_criteria = {_id:req.body._id};
        adminModel.updateAdmin(search_criteria, update_data, function(err, data){
            var return_data = {};
            var message = "";
            if (err) {
                return_data.error = err;
                res.json(return_data);
            } else{
                return_data.success = true;
                if(send_email == 1){
                    emailService.send(userDetails,emailSubject,emailTemplate,frm);
                }
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