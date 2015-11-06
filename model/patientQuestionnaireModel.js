var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var patientQuestionnaireSchema = new Schema({
    patient:{type:Schema.Types.ObjectId, ref:'Patient'},
    questionnaire_id:{type:Schema.Types.ObjectId, ref:'Questionnaire'},
    surgery:{type:Schema.Types.ObjectId, ref:'Surgery'},
    pathway:{type:Schema.Types.ObjectId, ref:'Pathway'},
    clinic:{type:Schema.Types.ObjectId, ref:'Admin'},
    is_deleted:{type:Number, default:0},
    is_active:{type:Number, default:0},
    status:{type:Number, default:0}, // 0=sent, 1=completed
    sent_on:{type:Number}, // Timestamp
    created:{type:Number},
    modified:{type:Number}
});

var PatientQuestionnaire = mongoose.model('PatientQuestionnaire', patientQuestionnaireSchema);

exports.getAllQuestionnaire = function(search_criteria, next){
    PatientQuestionnaire.find(search_criteria, next).populate('surgery').populate('clinic').populate('pathway');
}

exports.getQuestionnaire = function(search_criteria, next){
    PatientQuestionnaire.findOne(search_criteria, next).populate('surgery').populate('clinic').populate('pathway');
}

exports.updateQuestionnaire = function(search_criteria, new_data, next){
     PatientQuestionnaire.update(search_criteria, {$set:new_data}, next);
}

exports.addQuestionnaire = function(patientDetail, next){
    var add_questionnaire = new PatientQuestionnaire(patientDetail);
    add_questionnaire.save(next);
}