var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var patientSchema = ({
    username:{type:String, index: true, required:"Username is required."},
    password:{type:String, required:"Password is required."},
    first_name:{type:String, required:"First Name is required."},
    last_name:{type:String},
    email:{type:String, required:"Email is required."},
    date_of_birth:{type:Number, required:"Date of birth is required."},
    age: {type: Number, required:"Age is required."},
    gender:{type:String, required:"Gender is required."},
    phone:{type:Number},
    mobile:{type:Number, required:"Number is required."},

    address1:{type:String, required:"Address is required."},
    address2:{type:String},
    height:{type:Number, required:"Height is required."},
    weight:{type:Number, required:"Weight is required."},
    bmi:{type:String},
    dos:{type:Number, required:"Date of Surgery is required."},
    surgery:{type:Schema.Types.ObjectId, ref:"Surgery", required:"Surgery is required."},
    pathway:{type:Schema.Types.ObjectId, ref:"Pathway"/*, required:"Pathway is Required"*/},

    cci:{type:Number},

    clinicalTstage:{type:String},
    clinicalNstage:{type:String},
    clinicalMstage:{type:String},
    pathologicTstage:{type:String},
    pathologicNstage:{type:String},
    pathologicMstage:{type:String},
    neoadjuvant_chemotherapy:{type:String},
    tumor_laterality:{type:String},
    size_of_tumor:{type:Number},
    clavien_minor_no:{type:Number},
    clavien_major_no:{type:Number},
    sbl:{type:String},
    degfr:{type:String},
    discharge_hemoglobin:{type:String},
    blood_transfusion:{type:String},

    dohd:{type:Number},
    time_of_discharge:{type:String},
    type_tumor:{type:String},

    device_id:{type:String},
    gmt:{type:Number},
    clinic:{type:Schema.Types.ObjectId, ref:"Admin", required:"Clinic is required."},
    is_deleted:{type:Number, default:0},
    is_active:{type:Number, default:0},
    created:{type:Number},
    modified:{type:Number},
    
    admission_egfr:{type:String},
    dx:{type:String},
    admission_hemoglobin:{type:String},
    is_read_terms:{type:Number, default:0}, // 0 : No, 1: yes
    /* fitbit token parameters */
    access_token    :{type: String},
    refresh_token   :{type: String},
    token_type      :{type: String},
    user_id         :{type: String},
    expires_in      :{type: String},
    expires_at      :{type: String},
    timezone       :{}
});

var Patient = mongoose.model('Patient', patientSchema);

//Patient.index({ username: 1,email:1});

exports.getAllPatient = function(search_criteria, next){
    Patient.find(search_criteria, next).populate('surgery').populate('clinic').populate('pathway').lean();
}

exports.getPatient = function(search_criteria, fields, next){
    if(typeof fields !== 'undefined'){
        Patient.findOne(search_criteria, fields, next).populate('surgery').populate('clinic').populate('pathway');
    } else {
        Patient.findOne(search_criteria, next).populate('surgery').populate('clinic').populate('pathway');
    }
}

exports.getPatientData = function(search_criteria,next_id, next){
    //Patient.findOne(search_criteria, next).populate('surgery').populate('clinic').populate('pathway');
    Patient.findOne(search_criteria, function(err, data){
            var response = {};
            response.data = data;
            response.nextId = next_id;
            next(err, response);
    }).populate('surgery').populate('clinic').populate('pathway');
}

exports.getPatientDetail = function(search_criteria, fields, next){
    if(typeof fields !== 'undefined'){
        Patient.findOne(search_criteria, fields, next);
    } else {
        Patient.findOne(search_criteria, next);
    }
}

exports.updatePatient = function(search_criteria, new_data, next){
    Patient.update(search_criteria, {$set:new_data}, next);
}

exports.addPatient = function(patientDetail, next){
    var add_patient = new Patient(patientDetail);
    add_patient.save(next);
}