var Fitbit 	= require("fitbit-oauth2")
, moment        = require('moment')
, patientModel  = require("./../model/patientModel")
, fitbitModel   = require("./../model/fitbitModel")
, config        = require('./../config/oauth-creds.json' )
, config_server = require('./../config/oauth-creds-server.json' );

var fitbit = new Fitbit( config_server.fitbit );

authorize = function(req, res, next){
    req.session.patient_id = req.body.id;
    var patient_id = req.body.id;
    var search_patient  = {_id:patient_id};
    var fields          = {'access_token':1};
    
    return res.json({'uri':fitbit.authorizeURL()+'&prompt=login'});
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

/** Make an API call **/
secondApiCall = function(req, res, next){
    fitbit.request({
        uri: "https://api.fitbit.com/1/user/-/activities/heart/date/today/7d.json",
        method: 'GET',
    }, function( err, body, token ) {
        if ( err ){
            console.log('...secondApiCall error = ', err);
            return res.json({'uri':fitbit.authorizeURL()+'&prompt=login'});
        }else{
            var heart_rate = JSON.parse( body );
            if (typeof heart_rate['activities-heart'] != 'undefined') {
                var fData = {}; var hrData = {}; var stepsData = {};
                console.log('activities-heart count =>> ', heart_rate['activities-heart'].length);
                console.log('activities-heart ----------------\n', heart_rate['activities-heart']);
                hrData = heart_rate['activities-heart'];
                if (hrData.length > 0) {
                    fData.created           = moment().unix();
                    fData.patient           = req.session.patient_id;
                    //for (var i = 0; i < hrData.length; i++) {
                    //    console.log('\n ',i ,'In secondApiCall.');
                    //    saveHrData(i,hrData.length, hrData[i], fData, res, req);
                    //}
                    saveHrData(0, hrData, fData, res, req);
                }
            }
        }
    });
}


saveHrData = function(index, hrdata, fData, res, req){
    var newhrdata = hrdata[index];
    var i = moment(newhrdata.dateTime, 'YYYY-MM-DD').unix();
    var newdate = moment.unix(i).format('MM-DD-YYYY');    
    fData.date              = newdate;
    if (typeof newhrdata.value.restingHeartRate != 'undefined') {
        fData.avg_heart_rate    = newhrdata.value.restingHeartRate;
    }else{
        fData.avg_heart_rate    = 0;
    }
    
    var p_search = { patient : req.session.patient_id, date : fData.date };
    fitbitModel.getData(p_search, function(p_err, p_data){
        // update if record already exists. ==
        if(p_data){
            var search_criteria = { _id : p_data._id };
            var new_data        = {avg_heart_rate:fData.avg_heart_rate};
            fitbitModel.updateData(search_criteria, new_data, function(err, data){
                if(err){
                    console.log('\nUpdate error = ', err);
                }
                else if(data){
                    console.log('\n >>>>>>>>>> updateData success = ', data);
                }
                if (index+1 < hrdata.length) {
                    var newIndex = index + 1;
                    saveHrData(newIndex, hrdata, fData, res, req);
                }else if (index+1 == hrdata.length) {
                    hitStepsApi(res, req, fData);
                }
            });
        }
        // add if record doesn't exists. ++
        else{
            fitbitModel.addData(fData, function(err, data){
                if (err) {
                    console.log('\n---Add error in saveHrData\n', err);
                }else if(data){
                    console.log('\n ++++++++++++ add success = ', data);
                }
                if (index+1 < hrdata.length) {
                    //hitStepsApi(res,fData, req);
                   var newIndex = index + 1;
                   saveHrData(newIndex, hrdata, fData, res, req); 
                }else if (index+1 == hrdata.length) {
                    hitStepsApi(res, req, fData);
                }
            });
        }
    });
    //////////////////////////////
}


hitStepsApi = function(res, req, fData){
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
                    var fData = {};
                    //for (var i = 0; i < stepsData.length; i++) {
                    //    saveStepsData(i,stepsData.length, stepsData[i], fData, res, req);
                    //}
                    fData.created           = moment().unix();
                    fData.patient           = req.session.patient_id;
                    saveStepsData(0, stepsData, fData, res, req);
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

saveStepsData = function(index, steps_data, fData, res, req){
    var stepsdata = steps_data[index];
        var i = moment(stepsdata.dateTime, 'YYYY-MM-DD').unix();
        var newdate = moment.unix(i).format('MM-DD-YYYY');
    console.log(' ------ stepsdata ------\n', stepsdata);
        fData.date     = newdate;
    console.log('stepsdata.value = ', typeof stepsdata.value);    
        if (typeof stepsdata.value != 'undefined') {
            fData.steps    = parseInt(stepsdata.value);
        }else{
            fData.steps    = parseInt(0);
        }
        
    console.log(' ------fData ------\n', fData);
        
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
                    if (index+1 < steps_data.length) {
                        var newIndex = index + 1;
                        saveStepsData(newIndex, steps_data, fData, res, req);
                    }else if (index+1 == steps_data.length) {
                        return res.json("Patient data successfully added in database. Please close this tab.");
                    }
                });
            }
            /*
            // add if record doesn't exists. ++
            else{
                fitbitModel.addData(fData, function(err, data){
                    if (err) {
                        console.log('\nAdd error in function -> saveStepsData <-\n', err);
                    }
                    if (index+1 == length) {
                        return res.json("Patient data successfully added in database. Please close this tab.");
                    }
                });
            }
            */
        });
        
        
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
            //console.log('HR history-----------\n', fitbitData);
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
            //console.log('\nsteps data = ', fitbitData);
            if (typeof fitbitData[0] != 'undefined') {
                fitbitData[0].start_from = start_from.format('MM-DD-YYYY');
                fitbitData[0].end_date = moment().format('MM-DD-YYYY');
            }
            //console.log('\n -------------------------new steps data\n', fitbitData);
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