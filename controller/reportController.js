var patientAnswerModel = require("./../model/patientAnswerModel");
var moment = require('moment');
getlisting = function(req, res, next){
    var search = {};
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
