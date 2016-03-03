var patientAnswerModel = require("./../model/patientAnswerModel");
var moment = require('moment');
getlisting = function(req, res, next){
	console.log(req.body);
    var search = {};
    if(typeof req.body.limit != undefined){
    	var recLimit = {'limit':req.body.limit};
		patientAnswerModel.getList(search, {created:-1}, function(err, answerDetails){
	        if(err){
	            res.json(err);
	        } else{
	            res.json(answerDetails);
	        }
	    });
    }
    patientAnswerModel.getList(search, {created:-1},function(err, answerDetails){
        if(err){
            res.json(err);
        } else{
            res.json(answerDetails);
        }
    });
}
module.exports = function(){
    this.getlisting = getlisting;
}
