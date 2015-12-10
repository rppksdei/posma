var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var QuesSchema = new Schema({
    question:{type:Schema.Types.ObjectId, ref:'Question'},
    question_name:{type:String},
    question_type:{type:Number, default:0}, // 0=normal, 1= array
    answer:{type:String},
    answer_opts:[{type:Schema.Types.ObjectId}]
});

var patientAnswerSchema = ({
    patient:{type:Schema.Types.ObjectId, ref:'Patient'},
    surgery:{type:Schema.Types.ObjectId, ref:'Surgery'},
    pathway:{type:Schema.Types.ObjectId, ref:'Pathway'},
    questionnaire:{type:Schema.Types.ObjectId, ref:'Questionnaire'},
    questions:[QuesSchema],
    created:{type:Number},
    modified:{type:Number}
});

var PatientAnswer = mongoose.model('PatientAnswer', patientAnswerSchema);

exports.addPatientAns = function(patientDetail, next){
    var add_patient = new PatientAnswer(patientDetail);
    add_patient.save(next);
}