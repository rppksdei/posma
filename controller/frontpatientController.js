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
/*
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
*/

    savePatientAns = function(req, res, next){
        // console.log(JSON.parse(req.body.postData)); //return;
        var patient_data = JSON.parse(req.body.postData);
        var return_val = {}; var patientQues = {}; var i = 0; var temp = new Array();
        
        patientQues.created = Date.now();
        patientQues.patient = patient_data.patient;
        patientQues.questionnaire = patient_data.questionnaire; // this is notification id. need to update is_filled according to it.
        
        for (key in patient_data.quesData) {
            //getQuestionDetail(patient_data.quesData, i, key);
            var qData = {};
            qData.question      = key;
            qData.question_type = 0;
            qData.answer        = patient_data.quesData[key];
            //qData.question_name = getQuestionDetail(key);
            temp[i] = qData;
            i++;
        }
        
        if(patient_data.ansData!=null){
            // console.log('in ansdata >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
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
                temp[i++] = qData;
            }
        }
    // console.log('Out......................');
        patientQues.questions = temp;
        patientAnsModel.addPatientAns(patientQues, function(err, data){
            if (err) {
                if (err) {
                    res.json(err);
                }
                else{
                    return_val.error = err;
                    res.json(return_val);
                }
            }
            else{
                /* update notification table 'is_filled' value */
                var search_criteria = {_id : patient_data.notification_id};
                var update_data     = {is_filled:1};
            console.log('search_criteria : ', search_criteria);
            console.log('update_data : ', update_data);

                notificationModel.updateNotification(search_criteria, update_data, function(err, data){
                    var return_data = {};
                    var message = "";
                    if (err) {
                        res.json(err);
                    }
                    else{
                        return_val.success = "Patient Answers added Successfully";
                        res.json(return_val);
                    }
                });
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

