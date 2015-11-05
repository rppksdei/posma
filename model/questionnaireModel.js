var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var questionnaireSchema = ({
    name:{type:String, required:"Questionnaire name is required"},
    type:{type:String, default:'recursive',required:"Type is required"}, //single="Single", recursive="Recurrace"    
    question:[{type:Schema.Types.ObjectId, ref:"Question"}],
    execute_time:{type:Number, default:0}, // if single
    recur_type:{type:String}, // d=daily, w=weekly, m=monthly
    
    // if recur_type=d
    //daily_recurrence:{type:Number, default:1}, // 1 means once in a day

    time_slots:[{type:String}],

    // if recur_type=d OR  if recur_type=w
    start_day:{type:Number, default:0}, // then 0 means  startdate = aligned date
    total_days:{type:Number, default:0},
    
    // if recur_type=d + daily_recurrence = 1  OR  if recur_type=w OR  if recur_type=m
    //ontime:{type:Number },  // only for time
    
    // if recur_type=w
    days : [{type:Number}], // 1=monday, 2 tuesday and so on
    
    // if recur_type=m
    dates: [{type:Number}], // dates from 1 to 31
    
    // for all
    is_deleted:{type:Number, default:0},
    is_active:{type:Number, default:1},
    created:{type:Number},
    modified:{type:Number}
});

var Questionnaire = mongoose.model('Questionnaire', questionnaireSchema);

exports.getAllQuestionnaire = function(search_criteria, sort_order, next){
    if(!sort_order) {
        Questionnaire.find(search_criteria, next);
    } else {
        Questionnaire.find(search_criteria, next).sort(sort_order);
    }
}

exports.getQuestionnaire = function(search_criteria, next){
    Questionnaire.findOne(search_criteria, next).populate('question');
    // Questionnaire.findOne(search_criteria, next);
}

exports.updateQuestionnaire = function(search_criteria, new_data, next){
    Questionnaire.update(search_criteria, {$set:new_data}, next);
}

exports.addQuestionnaire = function(questionDetail, next){
    var add_questionnaire = new Questionnaire(questionDetail);
    add_questionnaire.save(next);
}