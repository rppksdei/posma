var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var fitbitSchema = new Schema({
    patient :               {type:Schema.Types.ObjectId, ref:'Patient'},
    avatar150:              {type:String},
    average_daily_steps:    {type:Number},
    display_name:           {type:String},
    distance_unit:          {type:String},
    full_name:              {type:String},
    gender:                 {type:String},
    height:                 {type:Number},
    height_unit:            {type:String},
    weight:                 {type:Number},
    weight_unit:            {type:String},
    nickname:               {type:String},
    offset_from_UTC_millis: {type:Number},
    timezone:               {type:String},
    created:{type:Number},
    modified:{type:Number}
});

var PatientFitbit = mongoose.model('PatientFitbit', fitbitSchema);

PatientFitbit.getAllQuestionnaire = function(search_criteria, next){
    PatientFitbit.find(search_criteria, next).populate('surgery').populate('clinic').populate('pathway');
}

PatientFitbit.getQuestionnaire = function(search_criteria, next){
    PatientFitbit.findOne(search_criteria, next).populate('surgery').populate('clinic').populate('pathway');
}

PatientFitbit.updateQuestionnaire = function(search_criteria, new_data, next){
     PatientFitbit.update(search_criteria, {$set:new_data}, next);
}

PatientFitbit.addQuestionnaire = function(patientDetail, next){
    var add_questionnaire = new PatientFitbit(patientDetail);
    add_questionnaire.save(next);
}

module.exports = PatientFitbit;