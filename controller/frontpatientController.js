var patientModel        = require("./../model/patientModel");
var patientAnsModel     = require("./../model/patientAnswerModel");
var questionModel       = require("./../model/questionModel");
var questionnaireModel  = require("./../model/questionnaireModel");
var alertModel          = require("./../model/alertModel");
var notificationModel   = require("./../model/notificationModel");
var passport = require('passport'),LocalStrategy = require('passport-local').Strategy;
var common = require('./../common.js');
var moment = require('moment');

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
                res.json({ 'code':0, 'success':true, 'type':user.user_type, 'user_id':user._id,'password':user.password,'username':user.username,'is_read_terms':user.is_read_terms});
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

checkTerms = function(req, res, next){
    var search_criteria = {username:req.body.username};
    var fields = {is_read_terms:1};
    patientModel.getPatientDetail(search_criteria, fields, function(err, patientData){
        if (err) {
            res.json( { 'code':401, 'error':'Not a patient', 'message':"Not a valid patient." } );
        } else {
            res.json(patientData);
        }
    });
}

setQuestiondata = function(admin_alert, fn){
    var quData = {};
    //console.log('+++++++admin_alert--\n', admin_alert);
    questionModel.getQuestion({'_id':admin_alert.question}, function(err, questionDetail) {
        if (err) {
            console.log('***Error in func = setQuestiondata');
        } else{
            //console.log('questionDetail = ', questionDetail);
            if (questionDetail != null) {
    
                quData.ques_name        = questionDetail.name;
                quData.answer_type      = questionDetail.answer_type;
                quData.gender           = questionDetail.gender;
                quData.question         = admin_alert.question;
                quData.ans              = admin_alert.ans;
                quData.multians         = admin_alert.multians;
                quData.questionnaire    = admin_alert.questionnaire;
                quData.datetime         = admin_alert.datetime;
                quData.clinic           = admin_alert.clinic;
                /*if(send_serach.anstype == 'text'){
                     quData.max_length       = questionDetail.max_length;
                } else if(send_serach.anstype == 'number'){
                    quData.min_range        = questionDetail.min_range;
                    quData.max_range        = questionDetail.max_range;
                } else */
                if(admin_alert.anstype == 'cb') {
                    var sel_cntr = 0;
                    answer_nameArr = new Array();
                    answer_out_of_rangeArr = new Array();
                    if(typeof admin_alert.multians != 'undefined'){
                        while(sel_cntr < admin_alert.multians.length){
                            var cntr = 0;
                            if(typeof questionDetail.answer != 'undefined'){
                                while(cntr < questionDetail.answer.length){
                                    if(questionDetail.answer[cntr]._id == admin_alert.multians[sel_cntr]){
                                        answer_nameArr[sel_cntr]           = questionDetail.answer[cntr].name;
                                        answer_out_of_rangeArr[sel_cntr]   = questionDetail.answer[cntr].out_of_range;
                                    }
                                    cntr++;
                                }
                                quData.answer_name          = answer_nameArr;
                                quData.answer_out_of_range  = answer_out_of_rangeArr;
                            }
                            sel_cntr++;
                        }
                    }
                } else if(admin_alert.anstype == 'rb' || admin_alert.anstype == 'dd') {
                    var cntr = 0;
                    while(cntr < questionDetail.answer.length){
                        if(questionDetail.answer[cntr]._id == admin_alert.ans){
                            quData.answer_name         = questionDetail.answer[cntr].name;
                            quData.ans                 = questionDetail.answer[cntr]._id;
                            quData.answer_out_of_range = questionDetail.answer[cntr].out_of_range;
                            break;
                        }
                        cntr++;
                    }
                }else if(admin_alert.anstype == 'number') {
                    //console.log('questionDetail = ', questionDetail);
                    //console.log('-----questionDetail.ans = ', questionDetail.answer);
                    quData.ans = null;
                    quData.answer_name         = admin_alert.ans;
                    quData.answer_out_of_range = true;                       
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

function setAllData(user, patientQues, patient_data, total_ques, admin_alerts, res){
    var i = 0; 
    var temp = new Array();
    var quDe = new Array();
    var qu_cnt = 0;

    if(patient_data.ansData!=null){
        for(key in patient_data.ansData){
            var qData = {};
            qData.question = key;
            var ans_keys = new Array(); 
            var y = 0;

            questionModel.getFieldsQuestion({'_id':key},
            {"_id":1,"name":1,"answer_type":1,'answer':1},qu_cnt,patient_data.ansData[key], function(err, ansDetail) {
                var ansDetail_data = ansDetail.data;
                var new_i = ansDetail.indexVal;
                var ans_ids = ansDetail.ansId;
                var qdetails = {};
                qdetails.name = ansDetail_data.name;
                qdetails._id = ansDetail_data._id;
                qdetails.answer_type = ansDetail_data.answer_type;
                var newAns= new Array();
                for(var ansCnt = 0; ansCnt < ansDetail_data.answer.length; ansCnt++) {
                    if(ansDetail_data.answer[ansCnt]._id in ans_ids) {
                        newAns.push(ansDetail_data.answer[ansCnt]);
                    }
                }
                qdetails.answer = newAns;
                quDe.push(qdetails);
                qu_cnt++;
                if(qu_cnt == total_ques){
                    patientQues.questions_details = quDe;
                    aveDetails(patientQues, patient_data, admin_alerts,res,user);
                }
            });
        }
    }

    for (key in patient_data.quesData) {
        var qData = new Array;
        qData.question      = key;
        qData.question_type = 0;
        qData.answer        = patient_data.quesData[key];
        temp[i] = qData;
        quDe[qu_cnt] = {};
        questionModel.getFieldsQuestion({'_id':key},
            {"_id":1,"name":1,"answer_type":1,'answer':1},qu_cnt,qData.answer, function(err, ansDetail) {
            var ansDetail_data = ansDetail.data;
            var new_i = ansDetail.indexVal;
            var ans_id = ansDetail.ansId;
            var qdetails = {};
            qdetails.name = ansDetail_data.name;
            qdetails._id = ansDetail_data._id;
            qdetails.answer_type = ansDetail_data.answer_type;
            var newAns= new Array();
            if(ansDetail_data.answer_type == 'rb'){

                var newAns = new Array();
                for(aw = 0;aw < ansDetail_data.answer.length;aw++){
                    if(ansDetail_data.answer[aw]._id == ans_id){
                        newAns.push(ansDetail_data.answer[aw]);
                    }
                    qdetails.answer = newAns;
                }
            } else if(ansDetail_data.answer_type == 'number'){
                qdetails.text_answer = ans_id;
            } else if(ansDetail_data.answer_type == 'text'){
                qdetails.text_answer = ans_id;
            }
            quDe.push(qdetails);
            qu_cnt++;
            if(qu_cnt == total_ques){
                patientQues.questionDetails = quDe;
                saveDetails(patientQues, patient_data, admin_alerts,res,user);
            }
        });
        i++;
    }
}

function saveDetails(patientQues, patient_data, admin_alerts,res,user){
    var return_val = {};
    patientAnsModel.addPatientAns(patientQues, function(err, data){
        if (err) {
            if (err) {
                res.json(err);
            } else {
                return_val.error = err;
                res.json(return_val);
            }
        } else {
            var lastInsertedId = data._id;
            var search_criteria = {_id : patient_data.notification_id};
            var update_data     = {is_filled:1};
            notificationModel.updateNotification(search_criteria, update_data, function(err, data){
                var patanserId = lastInsertedId;
                var return_data = {};
                var message = "";
                if (err) {
                    res.json(err);
                } else{
                    for(alert in admin_alerts){
                //console.log('...admin_alert...\n', admin_alerts[alert]);
                        if (admin_alerts[alert] != null) {
                            setQuestiondata(admin_alerts[alert],function(errQues, quReturnData){
                                var savealerts = {};
                                savealerts = quReturnData;
                                savealerts.patientanswer = patanserId;
                                savealerts.patient_first_name      = user.first_name;
                                savealerts.patient_last_name       = user.last_name;
                                savealerts.patient_email           = user.email;
                                savealerts.patient_username        = user.username;
                                savealerts.patient_mobile          = user.mobile;
                                savealerts.patient_surgery         = user.surgery.name;
                                savealerts.clinic_name             = user.clinic.clinic_name;
                                savealerts.clinic_first_name       = user.clinic.first_name;
                                savealerts.clinic_last_name        = user.clinic.last_name;
                                savealerts.clinic_email            = user.clinic.email;
                                savealerts.clinic_username         = user.clinic.username;
                                savealerts.clinic_mobile           = user.clinic.mobile;
                            //console.log('\n________savealerts________\n');
                                alertModel.addAlerts(savealerts, function(erralerts, dataalerts){
                                    if (err) {
                                        //res.json(err);
                                        console.log('Alert add error : ', err);
                                    }/* else{
                                        return_val.error = err;
                                        res.json(return_val);
                                    }*/
                                });
                            });
                        }
                    }
                    return_val.success = "Answers has been saved successfully.";
                    res.json(return_val);
                }
            });
            /* update notification table 'is_filled' value */
        }
    });
}


savePatientAns = function(req, res, next){
    // var patient_data = JSON.parse(req.body.postData);
    var return_val = {}; var patientQues = {}; 
    var i = 0; 
    var temp = new Array();
    var quDe = new Array();
    var qu_cnt = 0;

    var patient_full_data   = JSON.parse(req.body.postFullData);
    var patient_data = patient_full_data.postData;
    var admin_alerts = patient_full_data.admin_alerts;
    patientQues.created = moment().unix();
    patientQues.patient = patient_data.patient;
    patientQues.questionnaire = patient_data.questionnaire;
    patientModel.getPatient({'_id':patient_data.patient},function(err, user) {
        if (err) {
            /* SEND ERROR MESSAGE */
        } else {
            /* if answers as radio button or dropdown */
            var total_ques_withoutcheckbox = Object.keys(patient_data.quesData).length;
            var total_ques_checkbox = Object.keys(patient_data.ansData).length;
            var total_ques = total_ques_withoutcheckbox + total_ques_checkbox;
            setAllData(user,patientQues, patient_data, total_ques, admin_alerts,res);
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
    this.login           = login;
    this.userCookieLogin = userCookieLogin;
    this.checkloggedin   = checkloggedin;
    this.loggedout       = loggedout;
    this.savePatientAns  = savePatientAns;
    this.getDetail       = getDetail;
    this.checkTerms      = checkTerms;
}