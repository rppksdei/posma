var patientModel        = require("./../model/patientModel");
var patientAnsModel     = require("./../model/patientAnswerModel");
var questionModel       = require("./../model/questionModel");
var notificationModel   = require("./../model/notificationModel");
var passport = require('passport'),LocalStrategy = require('passport-local').Strategy;
var common = require('./../common.js');

login = function(req, res, next){
    passport.authenticate('localpatient', function(err, user, info){
        if (err){
            next(err);
            return;
        }
        if (!user){
            res.json( { 'code':401, 'error':'Unauthorized', 'message':info.message } );
            return;
        }
        req.logIn(user, { session: true },function (err){
            // Should not cause any errors
            if (err){
                next(err);
            }
            else{
                //console.log(user);
                //res.location('/questionnaire');
                //res.send(201, null);
                res.json({ 'code':0, 'success':true, 'type':user.user_type, 'user_id':user._id});
            }
            return; 
        });
    })(req, res, next);

}

userCookieLogin = function(req, res, next){
    var user_id = req.body.cookie_id;
    patientModel.getPatient({'_id':user_id}, function(err, user) {
        if (err) {
            res.json( { 'code':401, 'error':'Unauthorized', 'message':"Please log in" } );
        }
        else{
            req.logIn(user, { session: true },function (err){
            // Should not cause any errors
            if (err){
                next(err);
            }
            else{
                res.json({ 'code':0, 'success':true, 'type':user.user_type, 'user_id':user._id});
            }
            return; 
        });
            
        }
    });
}

checkloggedin = function(req, res, next){
  if(!req.isAuthenticated()){
    res.status(200).json( { 'code':401, 'error':'Unauthorized'} );
  }
  else {
    res.status(200).json(req.user);
  }  
}

loggedout = function(req, res, next){
    req.logout();
    res.json({'success':true});
}

getQuestionDetail = function(qvals, i, key){
    var search_question = {_id:key};
    questionModel.getQuestion(search_question, function(err, quesdata){
        var nam = '';
        if(quesdata){
            console.log('qname : ',quesdata.name);
            nam = quesdata.name;
        }
        return nam;
    });
}

    savePatientAns = function(req, res, next){
        //console.log(JSON.parse(req.body.postData));
        var patient_data = JSON.parse(req.body.postData);
        
        var return_val = {}; var patientQues = {}; var i = 0; var temp = new Array();
        
        patientQues.created = Date.now();
        patientQues.patient = patient_data.patient;
        patientQues.questionnaire = patient_data.questionnaire;
        
        for (key in patient_data.quesData) {
            //getQuestionDetail(patient_data.quesData, i, key);
            
            var qData = {};
            qData.question = key;
            //qData.question_name = getQuestionDetail(key);
            qData.question_type = 0;
            qData.answer = patient_data.quesData[key];
            temp[i] = qData;
            i++;
        }
        
        if(patient_data.ansData){
            for(key in patient_data.ansData){
                var qData = {};
                qData.question = key;
                    var search_question = {_id:key};
                    questionModel.getQuestion(search_question, function(err, quesdata){
                        if(quesdata){
                            qData.question_name = quesdata.name;
                        }
                    });
                var ans_keys = new Array(); var y = 0;
                for (key2 in patient_data.ansData[key]) {
                    ans_keys[y++] = key2;
                }
                qData.answer_opts = ans_keys;
            //console.log('ans_keys = ',ans_keys);
            //console.log('qData = ',qData);
                temp[i++] = qData;
            }
        }
        
        patientQues.questions = temp;
        patientAnsModel.addPatientAns(patientQues, function(err, data){
            if (err) {
                if (err.errors) {
                    var error_detail = [];
                    for (var errName in err.errors) {
                        error_detail.push(err.errors[errName].message);
                    }
                    return_val.error = error_detail;
                    res.json(return_val);
                }
                else{
                    return_val.error = err;
                    res.json(return_val);
                }
            }
            else{
                /* update notification table 'is_filled' value */
                var search_criteria = {questionnaire : patient_data.questionnaire, patient : patient_data.patient};
                notificationModel.update(search_criteria, update_data, function(err, data){
                    var return_data = {};
                    var message = "";
                    if (err) {
                        if (err.errors) {
                            var error_detail = [];
                            for (var errName in err.errors) {
                                error_detail.push(err.errors[errName].message);
                            }
                            return_data.error = error_detail;
                            res.json(return_data);
                        }
                        else{
                            return_data.error = message;
                            res.json(return_data);
                        }
                    }
                    else{
                        return_data.success = "Pathway updated Successfully";
                        res.json(return_data);
                    }
                });


                return_val.success = "Patient Answers added Successfully";
                res.json(return_val);
            }
        });
        
        //console.log('patientQues : ', patientQues);
        
        //if (data.success) {
        //    //add Admin cum clinic
        //    
        //    
        //    patientDetail.clinic  = req.user._id;
        //    patientDetail.date_of_birth     = dateToTimeStamp(req.body.date_of_birth);
        //    patientDetail.dos               = dateToTimeStamp(req.body.dos);
        //    //patientDetail.dohd              = dateToTimeStamp(req.body.dohd);
        //    patientDetail.is_active  = 1;
        //    //console.log(patientDetail);
        //    patientModel.addPatient(patientDetail, function(err, data){
        //        if (err) {
        //            if (err.errors) {
        //                var error_detail = [];
        //                for (var errName in err.errors) {
        //                    error_detail.push(err.errors[errName].message);
        //                }
        //                return_val.error = error_detail;
        //                res.json(return_val);
        //            }
        //            else{
        //                return_val.error = err;
        //                res.json(return_val);
        //            }
        //        }
        //        else{
        //            return_val.success = "Patient added Successfully";
        //            res.json(return_val);
        //        }
        //    });
        //}
        //else{
        //    var return_val = {'error':data.error};
        //    res.json(return_val);
        //}
    }

passport.use('localpatient', new LocalStrategy(
    function(username, password, done) {
        //password = common.encrypt(password);
        var userDetail = {'username':username, 'password':password};
        patientModel.getPatient(userDetail, function(err, user){
            if (err) {
                return done(err);
            }
            if (!user){
                return done(null, false, { message: 'Incorrect username or passwordssssssssss.' });
            }
            return done(null,user);
        });
    }
));

passport.serializeUser(function(user, done) {
    done(null, user._id);
});

passport.deserializeUser(function(id, done) {
    patientModel.getPatient({'_id':id}, function(err, user) {
        done(err, user);
    });
});

module.exports = function(){
    this.login = login;
    this.userCookieLogin = userCookieLogin;
    this.checkloggedin = checkloggedin;
    this.loggedout = loggedout;
    this.savePatientAns = savePatientAns;
}

