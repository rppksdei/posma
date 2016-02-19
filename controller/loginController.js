var adminModel = require('./../model/adminModel');
var passport = require('passport'),LocalStrategy = require('passport-local').Strategy;
var common = require('./../common.js');

exports.userlogin = function(req, res, next){
    passport.authenticate('local', function(err, user, info){
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
                console.log(user);
                res.json({ 'code':0, 'success':true, 'type':user.user_type, 'user_id':user._id});
            }
            return; 
        });
    })(req, res, next);
    
}
exports.userCookieLogin = function(req, res, next){
    var user_id = req.body.cookie_id;
    adminModel.getAdmin({'_id':user_id}, function(err, user) {
        if (err) {
            //code
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
exports.checkloggedin = function(req, res, next){
  if(!req.isAuthenticated()){
    res.status(200).json( { 'code':401, 'error':'Unauthorized'} );
  }
  else {
    res.status(200).json(req.user);
  }  
}
exports.loggedout = function(req, res, next){
    req.logout();
    res.json({'success':true});
}

passport.use('local', new LocalStrategy(
    function(username, password, done) {
        password = common.encrypt(password);
        console.log(password);
        var userDetail = {'username':username, 'password':password};
        adminModel.getAdmin(userDetail, function(err, user){
            if (err) {
                return done(err);
            }
            if (!user){
                return done(null, false, { message: 'Incorrect username or password.' });
            } else {
                if(user.is_active == 0){
                    return done(null, false, { message: 'Your account is inactive, please contact administrator.'});
                } else {
                    return done(null,user);
                }
            }
            
        });
    }
));
passport.serializeUser(function(user, done) {
    done(null, user._id);
});
passport.deserializeUser(function(id, done) {
    adminModel.getAdmin({'_id':id}, function(err, user) {
        done(err, user);
    });
});