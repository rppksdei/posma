var patientAnswerModel = require("./../model/patientAnswerModel");
var moment = require('moment');
getlisting = function(req, res, next){
    console.log('req.user = ', req.user._id);
    //console.log('req.user = ',req.user);
    var search = {'clinic_id':req.user._id};
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
            console.log('error...',err);
            res.json(err);
        } else{
            console.log('ans+++', answerDetails);
            res.json(answerDetails);
        }
    });
}
module.exports = function(){
    this.getlisting = getlisting;
}
