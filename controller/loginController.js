var adminModel = require('./../model/adminModel');
var passport = require('passport'),LocalStrategy = require('passport-local').Strategy;

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
                res.json({ 'code':0, 'success':true, 'type':user.user_type});
            }
            return; 
        });
    })(req, res, next);
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
        var userDetail = {'username':username, 'password':password};
        adminModel.getAdmin(userDetail, function(err, user){
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
    adminModel.getAdmin({'_id':id}, function(err, user) {
        done(err, user);
    });
});