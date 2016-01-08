var alertModel = require("./../model/alertModel");
var common = require('./../common.js');

getlisting = function(req, res, next){
    var search = {clinic:req.user._id};
    var sort_order = {created:-1, is_noted: 1 };
    if(typeof req.query.conditions != "undefined"){
        search = JSON.parse(req.query.conditions);
        search.is_deleted = 0;
        search.clinic = req.user._id;
    }

    alertModel.getList(search, sort_order, function(err, listData){
        if(err){
            res.json(err);
        } else{
            res.json(listData);
        }
    });
}

getAlert = function(req, res, next){
    var alert_id = req.body.id;
    var search_alert = {_id:alert_id};
    alertModel.getAlert(search_alert, function(err, data){
        var return_val = {};
        if (err){
            return_val.error = err;
            res.json(return_val);
        } else{
            if (data == null) {
                return_val.error = "Alert doesn't exists";
                res.json(return_val);
            } else{
                res.json(data);
            }
        }  
    });
}

addNotes = function(req, res, next){
    var alert_data = req.body;
    var update_data = {};
    
    if(typeof alert_data.notes != "undefined"){
        update_data.notes = alert_data.notes;
        update_data.is_noted = 1;
    }
    update_data.modified = Date.now();

    if(typeof req.body._id != "undefined"){
        var search_alert = {_id:alert_data._id};
        alertModel.update(search_alert, update_data, function(err, data){
            var return_data = {};
            var message = "";
            if (err) {
                return_data.error = err;
                res.json(return_data);
            } else{
                return_data.success = true;
                res.json(return_data);
            }
        });
    } else{
        var return_data = {};
        return_data.error = "Please select valid alert id to add notes.";
        res.json(return_data);
    }
}

module.exports = function(){
    this.getlisting = getlisting;
    this.getAlert = getAlert;
    this.addNotes = addNotes;
}