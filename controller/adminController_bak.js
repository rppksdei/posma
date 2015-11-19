var adminModel = require('./../model/adminModel');

exports.editprofile = function(req, res, next){
    
    //Code to create JSON object data
    var update_data = {};
    if(typeof req.body.username != "undefined"){
        update_data.username = req.body.username;
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
    if(typeof req.body.address1 != "undefined"){
        update_data.address1 = req.body.address1;
    }
    if(typeof req.body.address2 != "undefined"){
        update_data.address2 = req.body.address2;
    }
    //End of code to create object data;
    update_data.modified = Date.now();
    
    // code to create search criteria
    var search_criteria = {};
    if(typeof req.body.id != "undefined"){
        var search_criteria = {_id:req.body.id};
    }
    else if(typeof req.body.session != "undefined"){
        var search_criteria = {_id:req._id};
    }
    //End of code to create search criteria
    
    if(typeof search_criteria._id != "undefined"){
        adminModel.updateUser(search_criteria, update_data, function(err, data){
            var return_data = {};
            var message = "";
            if (err) {
                var errMessage = '';
                if (err.errors) {
                    for (var errName in err.errors) {
                        errMessage += err.errors[errName].message + "\n";
                    }
                    message += errMessage;
                }
                else{
                    message = err.message;
                }
                return_data.error = message;
                res.json(return_data);
            }
            else{
                return_data.success = "User updated Successfully";
                res.json(return_data);
            }
        });
    }
    else{
        return_data.error = "Please Send id to update";
        res.json(return_data);
    }
}