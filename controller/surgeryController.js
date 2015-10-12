var surgeryModel = require("./../model/surgeryModel");

getlisting = function(req, res, next){
    var search = {is_deleted:0};
    console.log('ddddd');
    surgeryModel.getAllSurgery(search, function(err, userDetail){
        if(err){
            res.json(err);
        }
        else{
            res.json(userDetail);
        }
    });
}

getSurgeryDetail = function(req, res){
    var surgery_id = req.params.id;
    var search_surgery = {_id:surgery_id};
    surgeryModel.getSurgery(search_surgery, function(err, data){
        var return_val = {};
        if (err){
            return_val.error = err;
            res.json(return_val);
        }
        else{
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
    console.log(req);
    var surgeryDetail = req.body;
    surgeryDetail.created   = Date.now();
    surgeryDetail.clinic    = req.user._id;
    surgeryModel.addSurgery(surgeryDetail, function(err, data){
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
            return_val.success = "Surgery added Successfully";
            res.json(return_val);
        }
      //  res.json(return_val);
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
    update_data.modified = Date.now();
    //End of code to create object data
    
    // Code to update clinic Details
    if(typeof req.body.surgery_id != "undefined"){
        var search_criteria = {};
        var search_criteria = {_id:req.body.surgery_id};
        //code
        surgeryModel.updateSurgery(search_criteria, update_data, function(err, data){
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



module.exports = function(){
    this.getlisting = getlisting;
    this.getSurgeryDetail = getSurgeryDetail;
    this.addSurgery = addSurgery;
    this.updateSurgeryDetail = updateSurgeryDetail;
}

