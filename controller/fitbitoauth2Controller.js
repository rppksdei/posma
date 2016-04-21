var Fitbit 	= require("fitbit-oauth2")
, moment        = require('moment')
, patientModel  = require("./../model/patientModel")
, fitbitModel   = require("./../model/fitbitModel")
, config        = require('./../config/oauth-creds.json' )
, config_server = require('./../config/oauth-creds-server.json' );

// Instanciate the client
//var fitbit = new Fitbit( config.fitbit );
var fitbit = new Fitbit( config_server.fitbit );
/**
    In a browser, http://localhost:8987/fitbit to authorize a user for the first time.
*/
authorize = function(req, res, next){
    //console.log('\nreq.body = ', req.body);
    req.session.patient_id = req.body.id;
    var patient_id = req.body.id;
    
    var search_patient  = {_id:patient_id};
    var fields          = {'access_token':1};
    /*
    // getting patient data to check if 'access_token' is present.
    patientModel.getPatient(search_patient, fields, function(err, data){
        if (err){
            console.log(err);
        } else {
            if (data == null) {
                console.log("Patient doesn't exists");
            } else{
                //console.log('data===\n', data);
                if (data.access_token != 'undefined' && data.access_token != null) {
                        fitbit.setToken( data.access_token );
                        req.uri = fitbit.authorizeURL();
                        secondApiCall(req, res, next);
                }else{
                    secondApiCall(req, res, next);
                }
                //res.json(data);
            }
        }
    });
    */
    return res.json({'uri':fitbit.authorizeURL()+'&prompt=login'});
    //res.redirect(fitbit.authorizeURL());
}

/** Make an API call **/
secondApiCall = function(req, res, next){
    fitbit.request({
        // Get Heart Rate Time Series
        uri: "https://api.fitbit.com/1/user/-/activities/heart/date/today/7d.json",
        /* Get Heart Rate Intraday Time Series */
        //uri: "https://api.fitbit.com/1/user/-/activities/heart/date/today/1d/1min/time/"+start_time+"/"+end_time+".json",
        method: 'GET',
    }, function( err, body, token ) {
        if ( err ){
            console.log('...secondApiCall error = ', err);
            return res.json({'uri':fitbit.authorizeURL()+'&prompt=login'});
        }else{
        //console.log('heart_rate = \n', body);
            var heart_rate = JSON.parse( body );
            if (typeof heart_rate['activities-heart'] != 'undefined') {
                var fData = {}; var hrData = {}; var stepsData = {};
                console.log('activities-heart count =>> ', heart_rate['activities-heart'].length);
                hrData = heart_rate['activities-heart'];
                if (hrData.length > 0) {
                    fData.created           = moment().unix();
                    fData.patient           = req.session.patient_id;
                    //fData.avg_heart_rate    = heart_rate['activities-heart'][0].value;
                    for (var i = 0; i < hrData.length; i++) {
                        saveHrData(i,hrData.length, hrData[i], fData, res, req);
                    }
                }
                
            
                
                /*else{
                    var p_search = { patient : req.session.patient_id, date : moment().format('MM-DD-YYYY'), start_time : start_time };
                    fitbitModel.getData(p_search, function(p_err, p_data){
                        // update if record already exists. ==
                        if(p_data){
                            var search_criteria = { _id : p_data._id };
                            var new_data        = {avg_heart_rate:fData.avg_heart_rate, heart_rate:fData.heart_rate };
                            fitbitModel.updateData(search_criteria, new_data, function(err, data){
                                if(err){
                                    console.log('\nUpdate error = ', err);
                                }
                            });
                        }
                        // add if record doesn't exists. ++
                        else{
                            fitbitModel.addData(fData, function(err, data){
                                var return_val = {};
                                if (err) {
                                    console.log('\nAdd error = ', err);
                                }
                            });
                        }
                    });
                }*/
            }
        }
    });
}

/**
    Callback service parsing the authorization token and asking for the access token. This endpoint is refered to in config.fitbit.authorization_uri.redirect_uri.
*/
oauthCallback = function(req, res, next){
    //console.log('------req => ',  req.body, req.params, req.query);
    var code = req.query.code;
    //console.log('------code => ',  code);
    fitbit.fetchToken( code, function( err, token ) {
        if ( err ) return next( err );
        // if token is not null, a refesh has happened and we need to persist the new token
        if ( token ){
            console.log('\ntoken in oauthCallback = ', token);
            //updateToken( req, token, function(err, data){
            //    if (err) {
            //        console.log(err);
            //    }
            //});
        }
        res.redirect( '/fitbit/getHR' );
    });
}

getHR = function(req, res, next){
    secondApiCall(req, res, next);
}

saveHrData = function(index, length, hrdata, fData, res, req){
        var i = moment(hrdata.dateTime, 'YYYY-MM-DD').unix();
        var newdate = moment.unix(i).format('MM-DD-YYYY');
    console.log('hrdata', hrdata);
        fData.date              = newdate;
        if (hrdata.value.restingHeartRate != 'undefined') {
            fData.avg_heart_rate    = hrdata.value.restingHeartRate;
        }else{
            fData.avg_heart_rate    = 0;
        }
    console.log('fData = ', fData);
        fitbitModel.addData(fData, function(err, data){
            var return_val = {};
            if (err) {
                console.log('\n---Add error in saveHrData\n', err);
            }
        });
    if (index+1 == length) {
        hitStepsApi(res,fData, req);
        //return res.json("Patient data successfully added in database. Please close this tab.");
    }
}

hitStepsApi = function(res, fData, req){
    //hit to get Steps for 7 days.
        fitbit.request({
            uri: "https://api.fitbit.com/1/user/-/activities/steps/date/today/7d.json",
            method: 'GET',
        },function( serr, sbody, stoken ) {
            if (serr) {
                console.log('\n--Steps Error-- : ', serr);
            }else if (sbody) {
    console.log('sbody = ', sbody);
                var allSteps = JSON.parse(sbody);
                console.log('\n--Steps Body-- : ', allSteps['activities-steps'][0].value);
                stepsData = allSteps['activities-steps'];
                if (stepsData.length > 0) {
                    for (var i = 0; i < stepsData.length; i++) {
                        saveStepsData(i,stepsData.length, stepsData[i], fData, res, req);
                    }
                }
                
                //fData.steps     = allSteps['activities-steps'][0].value;
                //console.log('\n___fData:\n', fData);
                //var p_search = { patient : req.session.patient_id, date : moment().format('MM-DD-YYYY'), start_time : start_time };
                /*
                fitbitModel.getData(p_search, function(p_err, p_data){
                    // update if record already exists. ==
                    if(p_data){
                        var search_criteria = { _id : p_data._id };
                        var new_data        = {avg_heart_rate:fData.avg_heart_rate, heart_rate:fData.heart_rate, steps:fData.steps};
                        fitbitModel.updateData(search_criteria, new_data, function(err, data){
                            if(err){
                                console.log('\nUpdate error = ', err);
                            }
                        });
                    }
                    // add if record doesn't exists. ++
                    else{
                        fitbitModel.addData(fData, function(err, data){
                            var return_val = {};
                            if (err) {
                                console.log('\nAdd error = ', err);
                            }
                        });
                    }
                });
                */
            }
        });
}

saveStepsData = function(index, length, stepsdata, fData, res, req){
        var i = moment(stepsdata.dateTime, 'YYYY-MM-DD').unix();
        var newdate = moment.unix(i).format('MM-DD-YYYY');
    console.log('stepsdata => ', stepsdata);
        fData.date     = newdate;
        fData.steps    = stepsdata.value;
    console.log('fData = ', fData);
        
        var p_search = { patient : req.session.patient_id, date : newdate };
        fitbitModel.getData(p_search, function(p_err, p_data){
            // update if record already exists. ==
            if(p_data){
                var search_criteria = { _id : p_data._id };
                var new_data        = {steps: stepsdata.value};
                fitbitModel.updateData(search_criteria, new_data, function(err, data){
                    if(err){
                        console.log('\nUpdate error in function -> saveStepsData <-\n', err);
                    }
                });
            }
            // add if record doesn't exists. ++
            else{
                fitbitModel.addData(fData, function(err, data){
                    if (err) {
                        console.log('\nAdd error in function -> saveStepsData <-\n', err);
                    }
                });
            }
        });
        
        if (index+1 == length) {
            return res.json("Patient data successfully added in database. Please close this tab.");
        }
}

getFitbitData = function(req, res, next){
    //console.log('req = ',req.body, req.query, req.post);
    var fields = {};
    if (typeof req.query.is_steps != 'undefined' && req.query.is_steps == 1) {
        var search = { steps:{$ne: null}, patient:req.query._id };
        fields = {'heart_rate':0};
    }else if (typeof req.query.is_date != 'undefined') {
        var search = { heart_rate:{$ne: null}, patient:req.query._id };
    }else if (typeof req.body.date != 'undefined') {
        var search = { heart_rate:{$ne: null}, patient:req.body._id, date:moment.unix(req.body.date).format('MM-DD-YYYY') };
    }else{
        var search = { heart_rate:{$ne: null}, patient:req.query._id, date:moment().format('MM-DD-YYYY') };
    }
    
    console.log('...search...\n',search);
    fitbitModel.getAll(search, fields, function(err, fitbitData){
        if(err){
            res.json(err);
        } else{
            console.log('HR history-----------\n', fitbitData);
            res.json(fitbitData);
        }
    });
}

getFitbitSteps = function(req, res, next){
    
    console.log('req = ',req.body, req.query, req.post);
    
    if (typeof req.body.date != 'undefined') {
        var start_from = moment.unix(req.body.date).subtract(7, "days");
        var search = { steps: {$ne: null}, patient: req.body._id, date: {$gte: start_from.format('MM-DD-YYYY')}};
    }else{
        var start_from = moment().subtract(7, "days");
        var search = { steps: {$ne: null}, patient: req.query._id, date: {$gte: start_from.format('MM-DD-YYYY')}};
    }
    
    //console.log('start_from -- ', start_from.format('MM-DD-YYYY'));
    var fields = { heart_rate : 0 };
    fitbitModel.getAll(search, fields, function(err, fitbitData){
        if(err){
            res.json(err);
        } else{
            var end_date = '';
            console.log('\nsteps data = ', fitbitData);
            if (typeof fitbitData[0] != 'undefined') {
                fitbitData[0].start_from = start_from.format('MM-DD-YYYY');
                fitbitData[0].end_date = moment().format('MM-DD-YYYY');
            }
            console.log('\n -------------------------new steps data\n', fitbitData);
            res.json(fitbitData);
        }
    });
}

module.exports = function(){
    this.authorize        = authorize;
    this.oauthCallback    = oauthCallback;
    this.getFitbitData    = getFitbitData;
    this.getHR            = getHR;
    this.getFitbitSteps   = getFitbitSteps;
    this.secondApiCall    = secondApiCall;
}