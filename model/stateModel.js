var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var citySchema = new Schema({
    city:{type:String},
    zip:{type:Number},
    lat:{type:Number},
    lng:{type:Number},
    is_active:{type:Number, default:1},
    is_deleted:{type:Number, default:0},
});

var stateSchema = new Schema({
    state:{type:String},
    cities:[citySchema],
    is_deleted:{type:Number, default:0},
    is_active:{type:Number, default:1},
});

var State = mongoose.model('State', stateSchema);

State.getAll = function(search_criteria,fields, next){
    State.find(search_criteria,fields, next);
}

State.getState = function(search_criteria, next){
    State.findOne(search_criteria, next);
}

State.updateAdmin = function(search_criteria, new_data, next){
    State.update(search_criteria, {$set:new_data}, next);
}

State.addState = function(stateDetail, next){
    var add_state = new State(stateDetail);
    add_state.save(next);
}

module.exports = State;