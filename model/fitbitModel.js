var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var fitbitSchema = new Schema({
    patient :               {type:Schema.Types.ObjectId, ref:'Patient'},
    /* Data from profile.json */
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
    
    /* Data from Heart Rate API */
    heart_rate  :[],
    start_time  :{type:String},
    end_time    :{type:String},
    avg_heart_rate : {type:String},
    date : {type:String},
    
    /* Data from Heart Rate API */
    steps:[],
    avg_steps : {type:String},
    
    created:{type:Number},
    modified:{type:Number}
});

var PatientFitbit = mongoose.model('PatientFitbit', fitbitSchema);

PatientFitbit.getAll = function(search_criteria, next){
    PatientFitbit.find(search_criteria, next).sort({'start_time':1});
}

PatientFitbit.getData = function(search_criteria, next){
    PatientFitbit.findOne(search_criteria, next);
}

PatientFitbit.updateData = function(search_criteria, new_data, next){
    PatientFitbit.update(search_criteria, {$set:new_data}, next);
}

PatientFitbit.addData = function(fitbitData, next){
    var add_data = new PatientFitbit(fitbitData);
    add_data.save(next);
}

module.exports = PatientFitbit;