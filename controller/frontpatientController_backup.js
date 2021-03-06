var patientModel        = require("./../model/patientModel");
var patientAnsModel     = require("./../model/patientAnswerModel");
var questionModel       = require("./../model/questionModel");
var questionnaireModel  = require("./../model/questionnaireModel");
var alertModel          = require("./../model/alertModel");
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
            } else{
                res.json({ 'code':0, 'success':true, 'type':user.user_type, 'user_id':user._id,'password':user.password});
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
        } else{
            req.logIn(user, { session: true },function (err){
                // Should not cause any errors
                if (err){
                    next(err);
                } else{
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
  } else {
    res.status(200).json(req.user);
  }  
}

loggedout = function(req, res, next){
    req.logout();
    res.json({'success':true});
}

getDetail = function(req, res, next){
    var search_criteria = {_id:req.body.pId};
    var fields = {_id:1, address1:1, age:1, bmi:1, date_of_birth:1, email:1, first_name:1, gender:1, height:1, last_name:1, mobile:1, weight:1 };
    patientModel.getPatientDetail(search_criteria, fields, function(err, patientData){
        if (err) {
            res.json( { 'code':401, 'error':'Not a patient', 'message':"Not a valid patient." } );
        } else {
            res.json(patientData);
        }
    });
}

setQuestiondata = function(key,selectedans, fn){
    var quData = {};
    questionModel.getQuestion({'_id':key}, function(err, questionDetail) {
        if (err) {
        } else{
            quData.ques_name        = questionDetail.name;
            quData.answer_type      = questionDetail.answer_type;
            quData.gender           = questionDetail.gender;
            
            // if(questionDetail.answer_type == 'text'){
            //     quData.max_length       = questionDetail.max_length;
            // } else if(questionDetail.answer_type == 'number'){

            //     quData.min_range        = questionDetail.min_range;
            //     quData.max_range        = questionDetail.max_range;

            // } else {
                var cntr = 0;
                while(cntr < questionDetail.answer.length){
                    if(questionDetail.answer[cntr]._id == selectedans){
                        quData.answer_name = questionDetail.answer[cntr].name;
                        quData.answer_out_of_range = questionDetail.answer[cntr].out_of_range;
                        break;
                    }
                    cntr++;
                }
            //}
        }
        fn(err,quData);
    });
}

setQuestionAnswers = function(key,ansData,fun){
    var search_question = {_id:key}; 
    questionModel.getQuestion(search_question, function(err, quesdata){
        if(quesdata){
            qData.question_name = quesdata.name;
            /**** to get all questions and selected answer information to store ********/
            qData.ques_name        = quesdata.name;
            qData.answer_type      = quesdata.answer_type;
            qData.gender           = quesdata.gender;
            var cntr = 0;
            var answers_selected = new Array();
            while(cntr < quesdata.answer.length){
                for (sel_ans in ansData[key]) {
                    answers_selected[sel_ans] = {};
                    if(quesdata.answer[cntr]._id == sel_ans){
                        answers_selected[sel_ans].answer_name = quesdata.answer[cntr].name;
                        answers_selected[sel_ans].answer_out_of_range = quesdata.answer[cntr].out_of_range;
                    }
                }
                cntr++;
            }
            qData.selected_answers = answers_selected;
            /**** END OF to get all questions and selected answer information to store ********/
        }
        fun(errr,answers_selected);
    });
}

savePatientAns = function(req, res, next){
    // var patient_data = JSON.parse(req.body.postData);
    var return_val = {}; var patientQues = {}; var i = 0; var temp = new Array();

    var patient_full_data = JSON.parse(req.body.postFullData);
    var patient_data = patient_full_data.postData;
    var admin_alerts = patient_full_data.admin_alerts;

    patientQues.created = Date.now();
    patientQues.patient = patient_data.patient;
    patientQues.questionnaire = patient_data.questionnaire;


    console.log('admin_alerts', admin_alerts);
    for(alert in admin_alerts){
        setQuestiondata(alert,admin_alerts[alert].ans,function(errQues, quReturnData){
            admin_alerts[alert].ques_name = quReturnData.ques_name;
            admin_alerts[alert].answer_type = quReturnData.answer_type;
            admin_alerts[alert].gender = quReturnData.gender;
            admin_alerts[alert].answer_name = quReturnData.answer_name;
            admin_alerts[alert].answer_out_of_range = quReturnData.answer_out_of_range;
            console.log('-----------NEW ADMIN ALERTS----------', admin_alerts[alert]);
        });
    }




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
                return done(null, false, { message: 'Incorrect username or password.' });
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
    this.getDetail = getDetail;
}var patientModel        = require("./../model/patientModel");
var patientAnsModel     = require("./../model/patientAnswerModel");
var questionModel       = require("./../model/questionModel");
var questionnaireModel  = require("./../model/questionnaireModel");
var alertModel          = require("./../model/alertModel");
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
            } else{
                res.json({ 'code':0, 'success':true, 'type':user.user_type, 'user_id':user._id,'password':user.password});
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
        } else{
            req.logIn(user, { session: true },function (err){
                // Should not cause any errors
                if (err){
                    next(err);
                } else{
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
  } else {
    res.status(200).json(req.user);
  }  
}

loggedout = function(req, res, next){
    req.logout();
    res.json({'success':true});
}

getDetail = function(req, res, next){
    var search_criteria = {_id:req.body.pId};
    var fields = {_id:1, address1:1, age:1, bmi:1, date_of_birth:1, email:1, first_name:1, gender:1, height:1, last_name:1, mobile:1, weight:1 };
    patientModel.getPatientDetail(search_criteria, fields, function(err, patientData){
        if (err) {
            res.json( { 'code':401, 'error':'Not a patient', 'message':"Not a valid patient." } );
        } else {
            res.json(patientData);
        }
    });
}

setQuestiondata = function(key,qData, fn){
    var quData = {};
    questionModel.getQuestion({'_id':key}, function(err, questionDetail) {
        if (err) {
        } else{
            quData.ques_name        = questionDetail.name;
            quData.answer_type      = questionDetail.answer_type;
            quData.gender           = questionDetail.gender;

            if(questionDetail.answer_type == 'text'){

                quData.max_length       = questionDetail.max_length;

            } else if(questionDetail.answer_type == 'number'){

                quData.min_range        = questionDetail.min_range;
                quData.max_range        = questionDetail.max_range;

            } else {
                var cntr = 0;
                while(cntr < questionDetail.answer.length){
                    if(questionDetail.answer[cntr]._id == qData.answer){

                        quData.answer_name = questionDetail.answer[cntr].name;
                        quData.answer_out_of_range = questionDetail.answer[cntr].out_of_range;
                        break;

                    }
                    cntr++;
                }
            }
        }
        fn(err,quData);
    });
}

setQuestionAnswers = function(key,ansData,fun){
    var search_question = {_id:key}; 
    questionModel.getQuestion(search_question, function(err, quesdata){
        if(quesdata){
            qData.question_name = quesdata.name;
            /**** to get all questions and selected answer information to store ********/
            qData.ques_name        = quesdata.name;
            qData.answer_type      = quesdata.answer_type;
            qData.gender           = quesdata.gender;
            var cntr = 0;
            var answers_selected = new Array();
            while(cntr < quesdata.answer.length){
                for (sel_ans in ansData[key]) {
                    answers_selected[sel_ans] = {};
                    if(quesdata.answer[cntr]._id == sel_ans){
                        answers_selected[sel_ans].answer_name = quesdata.answer[cntr].name;
                        answers_selected[sel_ans].answer_out_of_range = quesdata.answer[cntr].out_of_range;
                    }
                }
                cntr++;
            }
            qData.selected_answers = answers_selected;
            /**** END OF to get all questions and selected answer information to store ********/
        }
        fun(errr,answers_selected);
    });
}

savePatientAns = function(req, res, next){
    // var patient_data = JSON.parse(req.body.postData);
    var return_val = {}; var patientQues = {}; var i = 0; var temp = new Array();

    var patient_full_data = JSON.parse(req.body.postFullData);
    var patient_data = patient_full_data.postData;
    var admin_alerts = patient_full_data.admin_alerts;
    //var adminAlert = {};

    patientModel.getPatient({'_id':patient_data.patient},function(err, user) {
        if (err) {
        } else {
            /*adminAlert.patient.patient_first_name     = user.first_name;
            adminAlert.patient.patient_last_name      = user.last_name;
            adminAlert.patient.patient_email          = user.email;
            adminAlert.patient.patient_username       = user.username;
            adminAlert.patient.patient_mobile         = user.mobile;
            adminAlert.patient.patient_surgery        = user.surgery.name;
            adminAlert.patient.clinic_name            = user.clinic.clinic_name;
            adminAlert.patient.clinic_first_name      = user.clinic.first_name;
            adminAlert.patient.clinic_last_name       = user.clinic.last_name;
            adminAlert.patient.clinic_email           = user.clinic.email;
            adminAlert.patient.clinic_username        = user.clinic.username;
            adminAlert.patient.clinic_mobile          = user.clinic.mobile;*/

            patientQues.patient_first_name      = user.first_name;
            patientQues.patient_last_name       = user.last_name;
            patientQues.patient_email           = user.email;
            patientQues.patient_username        = user.username;
            patientQues.patient_mobile          = user.mobile;
            patientQues.patient_surgery         = user.surgery.name;
            patientQues.clinic_name             = user.clinic.clinic_name;
            patientQues.clinic_first_name       = user.clinic.first_name;
            patientQues.clinic_last_name        = user.clinic.last_name;
            patientQues.clinic_email            = user.clinic.email;
            patientQues.clinic_username         = user.clinic.username;
            patientQues.clinic_mobile           = user.clinic.mobile;










            
        }
    });

    patientQues.created = Date.now();
    patientQues.patient = patient_data.patient;
    patientQues.questionnaire = patient_data.questionnaire; 
    var sel_fields = {'recur_type':1,'name':1};
    // questionnaireModel.getQuestionnaireinfo({'_id':patientQues.questionnaire},sel_fields, function(err, questionnaireDetail) {
    //     if (err) {
    //     } else{
    //         //console.log('------------------',questionnaireDetail,'------------------------');
    //     }
    // });
    for (key in patient_data.quesData) {
        //getQuestionDetail(patient_data.quesData, i, key);
        var qData = {};
        qData.question      = key;
        qData.question_type = 0;
        qData.answer        = patient_data.quesData[key];
        /*setQuestiondata(key,qData,function(errQues, quReturnData){

            qData.ques_name = quReturnData.ques_name;
            qData.answer_type = quReturnData.answer_type;
            qData.gender = quReturnData.gender;
            qData.answer_name = quReturnData.answer_name;
            qData.answer_out_of_range = quReturnData.answer_out_of_range;
            temp[i] = qData;

        });*/
        temp[i] = qData;
        //patientQues.questions = temp;
        i++;
    }
    //console.log('------TEMP----',temp,'----------------');
    if(patient_data.ansData!=null){
        for(key in patient_data.ansData){
            var qData = {};
            qData.question = key;
            /*setQuestionAnswers(key,patient_data.ansData,function(errAns, quasReturnData){
                qData.ques_name = quasReturnData.ques_name;
                qData.answer_type = quasReturnData.answer_type;
                qData.gender = quasReturnData.gender;
                qData.answer_name = quasReturnData.answer_name;
                qData.answer_out_of_range = quasReturnData.answer_out_of_range;
            });*/
            var ans_keys = new Array(); var y = 0;
            for (key2 in patient_data.ansData[key]) {
                ans_keys[y++] = key2;
            }
            qData.answer_opts = ans_keys;
            temp[i++] = qData;
        }
    }
    //console.log(patientQues);
    patientQues.questions = temp;
    //console.log(patientQues);
    patientAnsModel.addPatientAns(patientQues, function(err, data){
        if (err) {
            if (err) {
                res.json(err);
            } else {
                return_val.error = err;
                res.json(return_val);
            }
        } else {
            
            if(typeof admin_alerts != "undefined"){
                console.log(admin_alerts,'\n');
                for(alert in admin_alerts){
                    //admin_alerts[alert] = adminAlert.patient;
                    admin_alerts[alert].created = Date.now();
                    console.log('------------------',admin_alerts[alert]);
                    alertModel.addAlerts(admin_alerts[alert], function(erralerts, dataalerts){
                        /*if (err) {
                            res.json(err);
                        } else{
                            return_val.error = err;
                            res.json(return_val);
                        }*/
                    });
                }
            }
            console.log('-------------search_criteria',patient_data);
            var search_criteria = {_id : patient_data.notification_id};
            console.log(search_criteria);
            var update_data     = {is_filled:1};
            notificationModel.updateNotification(search_criteria, update_data, function(err, data){
                var return_data = {};
                var message = "";
                if (err) {
                    res.json(err);
                } else{
                    return_val.success = "Answers has been saved successfully.";
                    res.json(return_val);
                }
            });
            
            /* update notification table 'is_filled' value */
        }
    });
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
                return done(null, false, { message: 'Incorrect username or password.' });
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
    this.getDetail = getDetail;
}