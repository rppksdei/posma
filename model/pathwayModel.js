var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var pathwaySchema = ({
    name:{type:String, required:"Name is Required"},
    description:{type:String},
    surgery:{type:Schema.Types.ObjectId, ref:'Surgery'},
    clinic:{type:Schema.Types.ObjectId, ref:'Clinic'},
    questionnaire:[{type:Schema.Types.ObjectId, ref:'Questionnaire'}],
    is_deleted:{type:Number, default:0},
    is_active:{type:Number, default:0},
    created:{type:Number},
    modified:{type:Number}
});

var Pathway = mongoose.model('Pathway', pathwaySchema);

exports.getAllPathway = function(search_criteria, next){
    Pathway.find(search_criteria, next).populate('questionnaire').populate('surgery');
}

exports.getPathway = function(search_criteria, next){
    Pathway.findOne(search_criteria, next);
}

exports.updatePathway = function(search_criteria, new_data, next){
     Pathway.update(search_criteria, {$set:new_data}, next);
}

exports.addPathway = function(pathwayDetail, next){
    var add_pathway = new Pathway(pathwayDetail);
    add_pathway.save(next);
}