var Fitbit 	= require("fitbit-oauth2")
, moment        = require('moment')
, patientModel  = require("./../model/patientModel")
, fitbitModel   = require("./../model/fitbitModel")
, config        = require('./../config/oauth-creds.json' );

// Instanciate the client
var fitbit = new Fitbit( config.fitbit );

/**
    In a browser, http://localhost:8987/fitbit to authorize a user for the first time.
*/
authorize = function(req, res, next){
    console.log('\nreq.body = ', req.body);
    req.session.patient_id = req.body.id;
    var patient_id = req.body.id;
    
    var search_patient  = {_id:patient_id};
    var fields          = {'access_token':1};
    
    // getting patient data to check if 'access_token' is present.
    patientModel.getPatient(search_patient, fields, function(err, data){
        if (err){
            console.log(err);
        } else {
            if (data == null) {
                console.log("Patient doesn't exists");
            } else{
                console.log('data===\n', data);
                if (data.access_token != 'undefined' && data.access_token != null) {
                    
                        fitbit.setToken( data.access_token );
                        req.uri = fitbit.authorizeURL();
                        apicall(req, res, 1, next);
                }else{
                    apicall(req, res, 1, next);
                }
                //res.json(data);
            }
        }
    });
    
    //return res.json({'uri':fitbit.authorizeURL()});
    //res.redirect(fitbit.authorizeURL());
}


/**
    Callback service parsing the authorization token and asking for the access token. This endpoint is refered to in config.fitbit.authorization_uri.redirect_uri.
*/
oauthCallback = function(req, res, next){
    console.log('------req => ',  req.body, req.params, req.query);
    var code = req.query.code;
    console.log('------code => ',  code);
    fitbit.fetchToken( code, function( err, token ) {
        if ( err ) return next( err );
        
        // if token is not null, a refesh has happened and we need to persist the new token
        if ( token ){
            console.log('\ntoken in oauthCallback = ', token);
            updateToken( req, token, function(err, data){
                if (err) {
                    console.log(err);
                }
            });
        }
        res.redirect( '/fitbit/getHR' );
    });
}

getHR = function(req, res, next){
    var cnt = 1;
    while (cnt <= 6) {
        apicall(req, res, cnt, next);
        cnt++;
    }
    if (cnt==7) {
        return res.json("Fitbit data successfully added in database. You can close this tab now.");
    }
    /*
    fitbit.request({
        // Get User Profile Data
        //uri: "https://api.fitbit.com/1/user/-/profile.json",
        
        // Get Heart Rate Time Series
        //uri: "https://api.fitbit.com/1/user/-/activities/heart/date/today/7d.json",
        
        // Get Heart Rate Intraday Time Series
        uri: "https://api.fitbit.com/1/user/-/activities/heart/date/today/1d/1min/time/00:00/04:00.json",
        
        method: 'GET',
    }, function( err, body, token ) {
        if ( err ) return next( err );
        var heart_rate = JSON.parse( body );

        console.log('\n-----------token = ', token);
        if ( token ){
            updateToken( req, token );
        }
        
        console.log('\n---------------session_____________\n', req.session);
        console.log('\n-----------------------heart_rate_____________\n', heart_rate);
        //res.send('<pre> Res = '+JSON.stringify( heart_rate, null, 2 )+'</pre>');
        
        if (typeof heart_rate['activities-heart'] != 'undefined') {
                var fData = {};
                fData.created           = moment().unix();
                fData.patient           = req.session.patient_id;
                if(typeof heart_rate != "undefined"){
                    fData.heart_rate    = heart_rate;
                }
                if(typeof steps != "undefined"){
                    fData.steps         = steps;
                }

                fitbitModel.addData(fData, function(err, data){
                    var return_val = {};
                    if (err) {
                        if (err.errors) {
                            var error_detail = [];
                            for (var errName in err.errors) {
                                error_detail.push(err.errors[errName].message);
                            }
                            return_val.error = error_detail;
                        } else {
                            return_val.error = err;
                        }
                    } else {
                        return_val.success = "Fitbit data successfully added in database. You can close this tab now.";
                    }
                    res.json(return_val);
                });
            
            
                //var update_data = {};
                //if(typeof heart_rate != "undefined"){
                //    update_data.heart_rate = heart_rate['activities-heart'];
                //}
                //if(typeof token != "undefined"){
                //    update_data.fitbit_token = token;
                //}
                //if(typeof steps != "undefined"){
                //    update_data.steps = steps;
                //}
                //update_data.modified = Date.now();
                ////console.log('\n-----------',update_data,'\n-----------');
                //// Code to update clinic Details
                //if(typeof req.session.patient_id != "undefined"){
                //    var search_criteria = {};
                //    var search_criteria = {_id:req.session.patient_id};
                //    patientModel.updatePatient(search_criteria, update_data, function(err, data){
                //        var return_data = {};
                //        if (err) {
                //            console.log(err);
                //            return_data.success = "Oops! Fitbit Data could not be updated in database at the moment. Please try later.";
                //        }else{
                //            return_data.success = "Fitbit data successfully updated in database. You can close this tab now.";
                //        }
                //        res.json(return_data.success);
                //    });
                //}
                //else{
                //    var return_data = {};
                //    return_data.error = "Please enter patient_id id to update";
                //    res.json(return_data);
                //}
            
        }else if (typeof heart_rate['errors'] != 'undefined') {
            res.send('<pre><b>Error</b><br/>'+JSON.stringify( heart_rate['errors'], null, 2 )+'</pre>');
        }
        
    });
    */
}

updateToken = function(req, token, fn){
    
        if (token) {
            var update_data = {};
            if(typeof token.access_token != "undefined"){
                update_data.access_token = token.access_token;
            }
            if(typeof token.refresh_token != "undefined"){
                update_data.refresh_token = token.refresh_token;
            }
            if(typeof token.token_type != "undefined"){
                update_data.token_type = token.token_type;
            }
            if(typeof token.user_id != "undefined"){
                update_data.user_id = token.user_id;
            }
            if(typeof token.expires_in != "undefined"){
                update_data.expires_in = token.expires_in;
            }
            if(typeof token.expires_at != "undefined"){
                update_data.expires_at = token.expires_at;
            }
            update_data.modified = Date.now();
            //var return_data = {};
            if(typeof req.session.patient_id != "undefined"){
                var search_criteria = {};
                var search_criteria = {_id:req.session.patient_id};
                patientModel.updatePatient(search_criteria, update_data, function(err, data){
                    if (err) {
                        fn(err, null);
                      //  console.log('\n---Error---\n',err);
                        //return_data.success = "Token not updated.";
                    }else{
                        console.log('\n---Success---\n',data);
                        fn(null, true);
                        //return_data.success = "Token updated successfully.";
                    }
                    //res.json(return_data.success);
                });
            }
        }
        else{
            fn(null, true);
        }
}

/** Make an API call **/
apicall = function(req, res, hitNo, next){
    //console.log('\nHi in api call');
    
    
    
    var start_time  = '', end_time    = '';
    if (hitNo==1) {
        start_time  = '00:00', end_time    = '04:00';
    }else if (hitNo==2) {
        start_time  = '04:00', end_time    = '08:00';
    }else if (hitNo==3) {
        start_time  = '08:00', end_time    = '12:00';
    }else if (hitNo==4) {
        start_time  = '12:00', end_time    = '16:00';
    }else if (hitNo==5) {
        start_time  = '16:00', end_time    = '20:00';
    }else if (hitNo==6) {
        start_time  = '20:00', end_time    = '24:00';
    }
    
    //console.log('-------------------------------------fitbit = \n', fitbit);
    
    fitbit.request({
        /* Get Heart Rate Intraday Time Series */
        uri: "https://api.fitbit.com/1/user/-/activities/heart/date/today/1d/1min/time/"+start_time+"/"+end_time+".json",
        method: 'GET',
    }, function( err, body, token ) {
        if ( err ){
            console.log('\n----err = ', err);
            if (hitNo==1) {
                console.log('fitbit.authorizeURL = ', fitbit.authorizeURL()+'&prompt=login');
                return res.json({'uri':fitbit.authorizeURL()+'&prompt=login'});
            }
            //return next( err );
        }else{
            var heart_rate = JSON.parse( body );
            //console.log('----------heart_rate-------------\n', heart_rate);
            console.log('\n-----------token = ', token);
            updateToken( req, token, function(err, data){
                if (data) {
                    //res.send('<pre> Res = '+JSON.stringify( heart_rate, null, 2 )+'</pre>');
                    if (typeof heart_rate['activities-heart'] != 'undefined') {
                            var fData = {};
                            console.log('value = ', heart_rate['activities-heart'][0].value);
                            fData.created           = moment().unix();
                            fData.date              = moment().format('MM-DD-YYYY');
                            fData.patient           = req.session.patient_id;
                            fData.start_time        = start_time;
                            fData.end_time          = end_time;
                            fData.avg_heart_rate    = heart_rate['activities-heart'][0].value;
                            
                            if(typeof heart_rate != "undefined"){
                                fData.heart_rate    = heart_rate;
                            }
                            if (hitNo==1) {
                                //hit to get Steps for each day.
                                fitbit.request({
                                    uri: "https://api.fitbit.com/1/user/-/activities/steps/date/today/1d.json",
                                    method: 'GET',
                                },function( serr, sbody, stoken ) {
                                    if (serr) {
                                        console.log('\n--Steps Error-- : ', serr);
                                    }else if (sbody) {
                                        var allSteps = JSON.parse(sbody);
                                        console.log('\n--Steps Body-- : ', allSteps['activities-steps'][0].value);
                                        fData.steps     = allSteps['activities-steps'][0].value;
                                        //console.log('\n___fData:\n', fData);
                                        var p_search = { patient : req.session.patient_id, date : moment().format('MM-DD-YYYY'), start_time : start_time };
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
                                    }
                                });
                            }
                            else{
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
                            }
                    }
                }
            });
        }
    });
}

getFitbitData = function(req, res, next){
    console.log('req = ',req.body, req.query, req.post);
    if (typeof req.body.date != 'undefined') {
        var search = { heart_rate:{$ne: null}, patient:req.body._id, date:moment.unix(req.body.date).format('MM-DD-YYYY') };
    }else{
        var search = { heart_rate:{$ne: null}, patient:req.query._id, date:moment().format('MM-DD-YYYY') };
    }
    
    console.log('...search...\n',search);
    fitbitModel.getAll(search, {}, function(err, fitbitData){
        if(err){
            res.json(err);
        } else{
            //console.log('fitbitData = \n', fitbitData);
            res.json(fitbitData);
        }
    });
}

getFitbitSteps = function(req, res, next){
    //console.log('Steps Req -- ',req.body, req.query, req.post);
    var start_from = moment().subtract(7, "days");
    //console.log('start_from -- ', start_from.format('MM-DD-YYYY'));
    var search = { steps: {$ne: null}, patient: req.query._id, date: {$gte: start_from.format('MM-DD-YYYY')}};
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
                //console.log('\n.......new steps data = ', fitbitData);
            }
            console.log('\n -------------------------new steps data\n', fitbitData);
            //res.json({'fitbitData' : fitbitData, 'start_from' : start_from.format('MM-DD-YYYY'), 'end_date' : moment().format('MM-DD-YYYY') });
            res.json(fitbitData);
        }
    });
}

module.exports = function(){
    this.authorize        = authorize;
    this.oauthCallback    = oauthCallback;
    this.getFitbitData    = getFitbitData;
    this.getHR            = getHR;
    this.updateToken      = updateToken;
    this.apicall          = apicall;
    this.getFitbitSteps   = getFitbitSteps;
    
}