var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// code for Passport Login
var expressSession = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


//End of code for Passport Login

var app = express();

// New routes for an application

// Database Connection
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/healthcare');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log('Database connected');
});
/*

var moment = require('moment-timezone');
console.log('--------My System Time---------',new Date().toString());
var dt = new Date().toString();

console.log('-------America/Los_Angeles----------',Date.parse(moment(new Date()).format()),'----------------------');

//moment().tz("America/Los_Angeles").format();

console.log('-------America/Los_Angeles----------',moment(new Date()).tz("America/Los_Angeles").format(),'----------------------');
console.log('-------America/Los_Angeles----------',Date.parse(moment(new Date()).tz("America/Los_Angeles").format()),'----------------------');

          */
/* var time = require('time');
var a = new time.Date(new Date().toString());
console.log('MY SYSTEM',new Date());
a.setTimezone('America/Los_Angeles');
console.log('America/Los_Angeles', a.toString());
*/

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
var basic_auth_token = '1234567890po23sm45a56';
/*
app.use('/',function(req, res, next) {
  var headerDetail = req.headers['auth-token'];
  if (typeof headerDetail != "undefined" && headerDetail == basic_auth_token) {
    next();
  }
  else{
    res.status(200).json( { 'code':401, 'error':'Unauthorized'} );  
  }
});
*/
/*
app.get('/superadmin',function(req, res, next) {
  //console.log('CLINIC');
  //console.log(__dirname);
  res.sendFile(__dirname+'/public/admin.html');
});

app.get('/',function(req, res, next) {
  //console.log('PATIENT');
  //console.log(__dirname);
  res.sendFile(__dirname+'/public/patient.html');
});
*/

// Code for Passport Session
app.use(expressSession({secret:"testnav",saveUninitialized:true,resave:true}));
app.use(passport.initialize());
app.use(passport.session());
//End of code for Passport Session


//Function to check session and user type
checksession = function(req, res, callback){
  if(!req.isAuthenticated()){
    callback(false);
  }
  else{
    callback(true);
  } 
}

isLoggedIn = function (req, res, next) {
  checksession(req, res,function(response){
    if(response){
      next();
    } else{
      res.status(200).json( { 'code':401, 'error':'Unauthorized'} );  
    }
  });
}

isSuperAdmin = function (req, res, next) {
  checksession(req, res,function(response){
    if(response){
      if (req.user.user_type == 1) {
        next();
      } else{
        res.status(200).json( { 'code':401, 'error':'Unauthorized'} );  
      }
    } else{
      res.status(200).json( { 'code':401, 'error':'Unauthorized'} );  
    }
  });
}

isClinicAdmin = function (req, res, next) {
  checksession(req, res,function(response){
    if(response){
      if (req.user.user_type == 0) {
        next();
      } else{
        res.status(200).json( { 'code':401, 'error':'Unauthorized'} );  
      }
    } else{
      res.status(200).json( { 'code':401, 'error':'Unauthorized'} );  
    }
  });
}

isSurgeon = function (req, res, next) {
  checksession(req, res,function(response){
    if(response){
      if (req.user.user_type == 2) {
        next();
      }
      else{
        res.status(200).json( { 'code':401, 'error':'Unauthorized'} );  
      }
      
    }
    else{
      res.status(200).json( { 'code':401, 'error':'Unauthorized'} );  
    }
  });
}
isClinicOrSurgeon = function (req, res, next) {
  checksession(req, res,function(response){
    if(response){
      if (req.user.user_type == 2 || req.user.user_type == 0) {
        next();
      } else{
        res.status(200).json( { 'code':401, 'error':'Unauthorized'} );  
      }
    } else{
      res.status(200).json( { 'code':401, 'error':'Unauthorized'} );  
    }
  });
}

isClinicOrAdmin = function (req, res, next) {
  checksession(req, res,function(response){
    if(response){
      if (req.user.user_type == 1 || req.user.user_type == 0) {
        next();
      }
      else{
        res.status(200).json( { 'code':401, 'error':'Unauthorized'} );  
      }
      
    }
    else{
      res.status(200).json( { 'code':401, 'error':'Unauthorized'} );  
    }
  });
}

supportCrossOriginScript = function (req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
        res.header("Access-Control-Allow-Credentials", true);
        next();
}


//End of functions to check session and user type
var emailService = require('./controller/emailService');



// Route Path
require('./routes/login')(app,express);
require('./routes/profile')(app,express, isLoggedIn);
//require('./routes/admin')(app,express);
require('./routes/admin')(app,express, isSuperAdmin, isClinicOrAdmin, emailService);
require('./routes/state')(app,express);
require('./routes/alert')(app,express,isClinicAdmin);
require('./routes/surgery')(app,express, isClinicOrSurgeon, isClinicAdmin);
require('./routes/question')(app,express, isClinicAdmin);
require('./routes/questionnaire')(app,express,supportCrossOriginScript);
require('./routes/notification')(app,express,supportCrossOriginScript);
require('./routes/pathway')(app, express, isClinicOrSurgeon, isClinicAdmin);
require('./routes/patient')(app,express, isClinicOrSurgeon, isClinicAdmin,supportCrossOriginScript);
require('./routes/front_patient')(app,express, supportCrossOriginScript);
require('./routes/patientQuestionnaire')(app,express);
require('./routes/cron')(app, express, isClinicOrSurgeon, isClinicAdmin);
require('./routes/report')(app, express, isClinicOrSurgeon, isClinicAdmin);
require('./routes/fitbit')(app,express);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  }); 
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

process.on('uncaughtException', function(err) {
  console.log('Uncaught exception: ' + err);
});

//app.listen(8987, function(err){
//  console.log('Posma server is running');
//});

module.exports = app;
