var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var alertSchema = new Schema({
    question:               {type:Schema.Types.ObjectId},
    ques_name:              {type:String},
    answer_type:            {type:String},
    anstype:                {type:String},
    gender:                 {type:String},
    questionnaire:          {type:Schema.Types.ObjectId, ref:"Questionnaire"},
    datetime:               {type:Number},
    ans:                    {type:Schema.Types.ObjectId},
    multians:               [{type:Schema.Types.ObjectId}],
    answer_name:            [{type:String}],
    answer_out_of_range:    [{type:String}],
    patient:                {type:Schema.Types.ObjectId},
    patient_first_name:     {type:String},
    patient_last_name:      {type:String},
    patient_email:          {type:String},
    patient_username:       {type:String},
    patient_mobile:         {type:Number},
    patient_surgery:        {type:String},
    clinic:                 {type:Schema.Types.ObjectId},
    clinic_name:            {type:String},
    clinic_first_name:      {type:String},
    clinic_last_name:       {type:String},
    clinic_email:           {type:String},
    clinic_username:        {type:String},
    clinic_mobile:          {type:Number},
    created:                {type:Number},
    modified:               {type:Number} 
});

var Alert = mongoose.model('Alert', alertSchema);
Alert.addAlerts = function(submit_data, next){
    var add_alert = new Alert(submit_data);
    add_alert.save(next);
}
Alert.getList = function(search_criteria, next){
    Alert.find(search_criteria, next).sort({'created':-1});
}
module.exports = Alert;