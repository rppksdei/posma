var adminModel = require("./../model/adminModel");

getUserDetail = function(req, res){
    var admin_id = req.user._id;
    var search_admin = {_id:admin_id};
    adminModel.getAdmin(search_admin, function(err, data){
        var return_val = {};
        if (err){
            return_val.error = err;
            res.json(return_val);
        }
        else{
            if (data == null) {
                return_val.error = "Admin doesn't exist.";
                res.json(return_val);
            }
            else{
                res.json(data);
            }
        }  
    });  
}
changePassword = function(req, res){
    var check_user = {};
    check_user._id = req.user._id;
    check_user.password = req.body.current_password;
    
    adminModel.getAdmin(check_user, function(err, data){
        var return_val = {};
        if (err) {
            return_val.error = err;
            res.json(err);
        }
        else{
            if (data == null) {
                return_val.error = "Enter correct current password.";
                res.json(return_val);
            }
            else{
                var search_criteria = {_id:req.user._id};
                var update_data = {'password':req.body.new_password};
                adminModel.updateAdmin(search_criteria, update_data, function(err, data){
                    if (err) {
                        //code
                        res.json(err);
                    }
                    else{
                        return_val.success = "Password has been changed successfully.";
                        res.json(return_val);
                    }
                });
            }
        }
    });

}

updateUserDetail = function(req, res){

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
    var search_criteria = {_id:req.user._id};
    adminModel.updateAdmin(search_criteria, update_data, function(err, data){
        var return_data = {};
        var message = "";
        if (err) {
            if (err.errors) {
                var error_detail = [];
                //var error = [];
                for (var errName in err.errors) {
                    error_detail.push(err.errors[errName].message);
                }
                return_data.error = error_detail;
                res.json(return_data);
            }
            else{
                return_data.error = err;
                res.json(return_data);
            }
        }
        else{
            console.log(data);
            return_data.success = "Profile updated Successfully";
            res.json(return_data);
        }
    });
    //End of code to update clinic detail
}



module.exports = function(){
    this.getUserDetail = getUserDetail;
    this.updateUserDetail = updateUserDetail;
    this.changePassword = changePassword;
    
}


