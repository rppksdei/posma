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
    var search_alert = {};
    if(typeof req.body.id != 'undefined'){
        var alert_id = req.body.id;
        search_alert = {_id:alert_id};
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
    } else if(typeof req.body.search != 'undefined') {
        var searchAl = req.body.search;
        var i = req.body.i;
        var j = req.body.j;
        var k = req.body.k;

        if(typeof searchAl.patient_answer != 'undefined'){
            search_alert.patientanswer = searchAl.patient_answer;
        }
        if(typeof searchAl.question != 'undefined'){
            search_alert.question = searchAl.question;
        }
        if(typeof searchAl.ans != 'undefined'){
            search_alert.ans = searchAl.ans;
        } else if(searchAl.answer_opts != 'undefined'){
            search_alert.multians = {'$in': searchAl.answer_opts};
        }
        alertModel.getPatientAlert(search_alert, function(err, data){
            var return_val = {};
            if (err){
                return_val.error = err;
                res.json(return_val);
            } else{
                if (data == null) {
                    return_val.error = "Alert doesn't exists";
                    res.json(return_val);
                } else{
                    var return_data = {};
                    return_data.data = data;
                    return_data.i = i;
                    return_data.j = j;
                    return_data.k = k;
                    res.json(return_data);
                }
            }  
        });
    }
    
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