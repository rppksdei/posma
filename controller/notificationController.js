var notificationModel = require("./../model/notificationModel");

getNotification = function(req, res, next){
    search_condition = {is_filled:0};
    //var userDetail = {'username':username, 'password':password};
    if(typeof req.body != 'undefined'){
        //search_condition = JSON.parse(req.query.conditions);
        if(typeof req.body.isFilled != 'undefined'){
        search_condition.is_filled = req.body.isFilled;
        }
        if(typeof req.body.pId != 'undefined'){
        search_condition.patient = req.body.pId;
        }
       /* search_condition.is_filled = req.body.isFilled;
        search_condition.patient = req.body.;*/
    }
    notificationModel.getAll(search_condition,'', function(err, details){
        if(err){
            res.json(err);
        } else{
            res.json(details);
        }
    });
}
module.exports = function(){
    this.getNotification = getNotification;
}
