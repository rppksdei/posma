var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var patientSchema = ({
    username:{type:String, required:"Username is required"},
    password:{type:String, required:"Password is required"},
    first_name:{type:String, required:"First Name is Required"},
    last_name:{type:String},
    email:{type:String, required:"Email is required"},
    date_of_birth:{type:Number, required:"Date of Birth is required"},
    gender:{type:String, required:"Gender is required"},
    address1:{type:String, required:"Address is Required"},
    address2:{type:String},
    phone:{type:Number, required:"Number is Required"},
    mobile:{type:Number},
    surgery:{type:Schema.Types.ObjectId, ref:"Surgery", required:"Surgery is Required"},
    clinic:{type:Schema.Types.ObjectId, ref:"Admin", required:"Clinic is Required"},
    pathway:{type:Schema.Types.ObjectId, ref:"Pathway"/*, required:"Pathway is Required"*/},
    is_deleted:{type:Number, default:0},
    is_active:{type:Number, default:0},
    created:{type:Number},
    modified:{type:Number},
    age: {type: Number, required:"Age is required"},
    dos:{type:Number, required:"Date of Surgery is required"},
    dohd:{type:Number, required:"Date of hospital discharge is required"},
    cci:{type:Number},
    type_tumor:{type:String},
    tnm:{type:String},
    tmn:{type:String},
    bmi:{type:String},
    clavien_minor_no:{type:Number},
    clavien_major_no:{type:Number},
    sbl:{type:String},
    degfr:{type:String},
    discharge_hemoglobin:{type:String},
    blood_transfusion:{type:String} 
});

var Patient = mongoose.model('Patient', patientSchema);

exports.getAllPatient = function(search_criteria, next){
    Patient.find(search_criteria, next).populate('surgery').populate('clinic').populate('pathway');
}

exports.getPatient = function(search_criteria, next){
    Patient.findOne(search_criteria, next).populate('surgery').populate('clinic').populate('pathway');
}

exports.updatePatient = function(search_criteria, new_data, next){
     Patient.update(search_criteria, {$set:new_data}, next);
}

exports.addPatient = function(patientDetail, next){
    var add_patient = new Patient(patientDetail);
    add_patient.save(next);
}