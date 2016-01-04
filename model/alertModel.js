var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var alertSchema = new Schema({
    ans:            {type:Schema.Types.ObjectId},
    multians:       [{type:Schema.Types.ObjectId}],
    anstype:        {type:String},
    clinic:         {type:Schema.Types.ObjectId, ref:"Admin"},
    datetime:       {type:Number},
    patient:        {type:Schema.Types.ObjectId, ref:"Patient"},
    questionnaire:  {type:Schema.Types.ObjectId, ref:"Questionnaire"},
    question:  {type:Schema.Types.ObjectId, ref:"Question"},
    created:        {type:Number},
    modified:       {type:Number} 
});
var Alert = mongoose.model('Alert', alertSchema);
Alert.addAlerts = function(submit_data, next){
    var add_alert = new Alert(submit_data);
    add_alert.save(next);
}
Alert.getList = function(search_criteria, next){
    Alert.find(search_criteria, next).populate('patient').populate('question');
}
module.exports = Alert;