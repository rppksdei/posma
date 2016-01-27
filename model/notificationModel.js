var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var notificationSchema = new Schema({
    patient:{type:Schema.Types.ObjectId, ref:"Patient"},
    questionnaire:{type:Schema.Types.ObjectId, ref:"Questionnaire"},
    questionnaire_name:{type:String},
    datetime:{type:Number},
    message:{type:String},
    is_filled:{type:Number, default:0},
    created:{type:Number},
    modified:{type:Number},
    device_id:{type:String}
});
/*
db.notifications.insert({
    'patient' : ObjectId("562f00ae852fa25c123871a0"),
    'questionnaire': ObjectId("563c51e84f2c779c4ed8473e"),
    'datetime': 1448002780943,
    'message': 'Its a test notification for Q1',
    'is_filled': 0,
    'created': 1448002780943,
    'modified': 1448002780943
});*/

var Notification = mongoose.model('Notification', notificationSchema);

Notification.getAll = function(search_criteria, sort_order, next){
    if(!sort_order || sort_order == '-') {
        Notification.find(search_criteria, next).populate('questionnaire');
    } else {
        Notification.find(search_criteria, next).populate('questionnaire').sort(sort_order);
    }
}

Notification.getOne = function(search_criteria, next){
    Notification.findOne(search_criteria, next).populate('questionnaire');
}

Notification.add = function(submit_data, next){
    var add_notification = new Notification(submit_data);
    add_notification.save(next);
}

Notification.updateNotification = function(search_criteria, new_data, next){
    //console.log('HERE');
    Notification.update(search_criteria, {$set:new_data}, next);
}

module.exports = Notification;
