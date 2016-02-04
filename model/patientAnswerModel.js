var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var QuesSchema = new Schema({
    question:{type:Schema.Types.ObjectId, ref:'Question'},
    question_name:{type:String},
    question_type:{type:Number, default:0}, // 0=normal, 1= array
    answer:{type:String},
    answer_opts:[{type:Schema.Types.ObjectId}]
});

var AnsweDetailedSchema = new Schema({
    _id:{type:Schema.Types.ObjectId},
    name:{type:String},
    out_of_range:{type:String},
    is_deleted:{type:String}
});

var QuesDetailedSchema = new Schema({
    _id:{type:Schema.Types.ObjectId},
    name:{type:String},
    answer_type:{type:String},
    answer: [AnsweDetailedSchema],
    text_answer:{type:String}
});

var patientAnswerSchema = ({

    patient:{type:Schema.Types.ObjectId, ref:'Patient'},
    surgery:{type:Schema.Types.ObjectId, ref:'Surgery'},
    pathway:{type:Schema.Types.ObjectId, ref:'Pathway'},
    questionnaire:{type:Schema.Types.ObjectId, ref:'Questionnaire'},
    questions:[QuesSchema],
    datetime: {type:Number},

    questionDetails:[QuesDetailedSchema],

    is_detailed:{type:Number, default:0}, // 0:no detail added by cron, 1: question and answers details added by cron

    questionnaire_name:{type:String},
    questionnaire_recur_type:{type:String},
    created:{type:Number},
    modified:{type:Number},

    patient_first_name: {type:String},
    patient_last_name: {type:String},
    patient_email: {type:String},
    patient_username: {type:String},
    patient_mobile: {type:String},
    patient_surgery: {type:String},

    clinic_name: {type:String},
    clinic_first_name: {type:String},
    clinic_last_name: {type:String},
    clinic_email: {type:String},
    clinic_username: {type:String},
    clinic_mobile: {type:String},
});

var PatientAnswer = mongoose.model('PatientAnswer', patientAnswerSchema);

PatientAnswer.addPatientAns = function(patientDetail, next){
    var add_patient = new PatientAnswer(patientDetail);
    add_patient.save(next);
}

PatientAnswer.updatePA = function(search_criteria, new_data, next){
    PatientAnswer.update(search_criteria, {$set:new_data}, next);
}
PatientAnswer.getList = function(search_criteria, sort_order, next){
    PatientAnswer.find(search_criteria, next).sort(sort_order).populate('patient');
}

module.exports = PatientAnswer;