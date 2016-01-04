var alertModel = require("./../model/alertModel");
var common = require('./../common.js');

getlisting = function(req, res, next){
    var search = {clinic:req.user._id};
    //var sort_order = {created: -1 };
    if(typeof req.query.conditions != "undefined"){
        search = JSON.parse(req.query.conditions);
        search.is_deleted = 0;
        search.clinic = req.user._id;
        sort_order = req.query.sort_order;
    }

    if(typeof req.query.conditions != 'undefined'){
        search = JSON.parse(req.query.conditions);
    }
    alertModel.getList(search, function(err, listData){
        if(err){
            res.json(err);
        } else{
            res.json(listData);
        }
    });
}

module.exports = function(){
    this.getlisting = getlisting;
}