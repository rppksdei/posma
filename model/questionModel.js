var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var answerSchema = new Schema({
    name:{type:String, required:"Option is required"},
    out_of_range:{type:String, default:0}, // 0=in range, 1=out of range
    is_deleted:{type:Number, default:0},
    created:{type:Number},
    modified:{type:Number}
});


var questionSchema = new Schema({
    name:{type:String, required:"Question name is required"},
    answer_type:{type:Number, default:0}, //0=Text, 1=Number
    min_range:{type:Number},
    max_range:{type:Number},
    max_length:{type:Number, default:0},
    gender:{type:String, default:"b"}, //m=Male, f=Female, b=Both
    clinic:{type:Schema.Types.ObjectId, ref:'Clinic'},
    answer:[answerSchema],
    is_deleted:{type:Number, default:0},
    created:{type:Number},
    modified:{type:Number} 
});

var Question = mongoose.model('Question', questionSchema);


exports.getAllQuestion = function(search_criteria, next){
    Question.find(search_criteria, next);
}

exports.getQuestion = function(search_criteria, next){
    Question.findOne(search_criteria, next);
}

exports.updateQuestion = function(search_criteria, new_data, next){
     Question.update(search_criteria, {$set:new_data}, next);
}

exports.addQuestion = function(questionDetail, next){
    var add_question = new Question(questionDetail);
    add_question.save(next);
}