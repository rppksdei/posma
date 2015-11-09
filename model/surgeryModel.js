var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SurgerySchema = ({
    clinic:{type:Schema.Types.ObjectId, ref:'Clinic', required:"Clinic is required"},
    name:{type:String, required:"Name is required"},
    description:{type:String},
    is_deleted:{type:Number, default:0},
    is_active:{type:Number, default:0},
    created:{type:Number},
    modified:{type:Number},
});

var Surgery = mongoose.model('Surgery', SurgerySchema);

exports.getAllSurgery = function(search_criteria, next){
    console.log('IN MODEL');
    console.log(search_criteria);
    Surgery.find(search_criteria, next);
}

exports.getSurgery = function(search_criteria, next){
    Surgery.findOne(search_criteria, next);
}

exports.updateSurgery = function(search_criteria, new_data, next){
     Surgery.update(search_criteria, {$set:new_data}, next);
}

exports.addSurgery = function(surgeryDetail, next){
    var add_surgery = new Surgery(surgeryDetail);
    add_surgery.save(next);
}

// exports.getSurgeryByClinic = function(search_criteria, next){
//     Surgery.find(search_criteria, next);
// }