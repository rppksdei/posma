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
//End of code for Database Connection


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
    }
    else{
      res.status(200).json( { 'code':401, 'error':'Unauthorized'} );  
    }
  });
}

isSuperAdmin = function (req, res, next) {
  checksession(req, res,function(response){
    if(response){
      if (req.user.user_type == 1) {
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

isClinicAdmin = function (req, res, next) {
  checksession(req, res,function(response){
    if(response){
      if (req.user.user_type == 0) {
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


//End of functions to check session and user type 

// Route Path
require('./routes/login')(app,express);
require('./routes/profile')(app,express, isLoggedIn);
require('./routes/admin')(app,express, isSuperAdmin);
require('./routes/surgery')(app,express);
require('./routes/question')(app,express, isClinicAdmin);
require('./routes/questionnaire')(app,express);
require('./routes/pathway')(app,express);
require('./routes/patient')(app,express);
require('./routes/patientQuestionnaire')(app,express);


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


module.exports = app;
