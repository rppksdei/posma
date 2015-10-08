var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var adminSchema = new Schema({
    username:{type:String, required:"Username is required"},
    password:{type:String, required:"Password is required"},
    clinic_name:{type:String},
    first_name:{type:String},
    last_name:{type:String},
    email:{type:String},
    phone:{type:Number},
    user_type:{type:Number, default:0}, //1=Super admin, 0=clinic Admin, 2=Surgeon Login
    mobile:{type:Number},
    address1:{type:String},
    address2:{type:String},
    parent_id:{type:Schema.Types.ObjectId}, // if it is surgeon then it will be clinic id otherwise it will be 0
    is_deleted:{type:Number, default:0},
    is_active:{type:Number, default:0},
    created:{type:Number},
    modified:{type:Number}
});

var Admin = mongoose.model('Admin', adminSchema);

exports.getAllAdmin = function(search_criteria, next){
    Admin.find(search_criteria, next);
}

exports.getAdmin = function(search_criteria, next){
    Admin.findOne(search_criteria, next);
}

exports.updateAdmin = function(search_criteria, new_data, next){
     Admin.update(search_criteria, {$set:new_data}, next);
}

exports.addAdmin = function(adminDetail, next){
    var add_admin = new Admin(adminDetail);
    add_admin.save(next);
}
