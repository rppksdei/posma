var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var adminSchema = new Schema({
    username:{type:String, required:"Username is Required"},
    password: {type:String, required:"Password is required"},
    first_name:String,
    last_name:String,
    email:String,
    address1:String,
    address2:String,
    Created:Number,
    Modified:Number
});

var Admin = mongoose.model('Admin', adminSchema);