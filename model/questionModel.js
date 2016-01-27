var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var answerSchema = new Schema({
    name:{type:String, required:"Option is required."},
    out_of_range:{type:String, default:false}, // 0=in range, 1=out of range
    is_deleted:{type:Number, default:0},
    created:{type:Number},
    modified:{type:Number}
});

var questionSchema = new Schema({
    name:{type:String, required:"Question name is required. "},
    answer_type:{type:String, default:'text'}, //0=Text, 1=Number
    min_range:{type:Number},
    max_range:{type:Number},
    max_length:{type:Number, default:0},
    gender:{type:String, default:"b"}, //m=Male, f=Female, b=Both
    clinic:{type:Schema.Types.ObjectId, ref:'Clinic'},
    answer:[answerSchema],
    is_active:{type:Number, default:1},
    is_deleted:{type:Number, default:0},
    created:{type:Number},
    modified:{type:Number} 
});

var Question = mongoose.model('Question', questionSchema);

Question.getAllQuestion = function(search_criteria, sort_order, next){
    if(!sort_order || sort_order == '-') {
        Question.find(search_criteria, next);
    } else {
        Question.find(search_criteria, next).sort(sort_order);
    }
}

Question.getQuestion = function(search_criteria, next){
    Question.findOne(search_criteria, next);
}

Question.getFieldsQuestion = function(search_criteria,fields_sel,i, next){
    if(typeof fields_sel == 'undefined' && typeof i == 'undefined') {
        Question.findOne(search_criteria, next);
    } else {
        Question.findOne(search_criteria, fields_sel, function(err, data){
            var response = {};
            response.indexVal = i;
            response.data = data;
            next(err, response);
        });
    }
}

Question.updateQuestion = function(search_criteria, new_data, next){
     Question.update(search_criteria, {$set:new_data}, next);
}

Question.addQuestion = function(questionDetail, next){
    var add_question = new Question(questionDetail);
    add_question.save(next);
}

module.exports = Question;