module.exports = function(app,express){
    var router              = express.Router();
    var fitbitController    = require("./../controller/fitbitController");
    //var fitObj              = new fitbitController();
    /*
	    // OAuth flow
	    router.get('/authorize',function(req, res, next) {
		fitObj.authorize(req, res, next);
	    });
	    
	    // On return from the authorization
	    router.get('/oauthcallback',function(req, res) {
		fitObj.oauthCallback(req, res);
	    });
    */
    
    
    /*----------- using NEW fitbit-oauth2 -----------------*/
    
    var fitbitoauth2Controller    	= require("./../controller/fitbitoauth2Controller");
    var fitObj              		= new fitbitoauth2Controller();
    
    router.get('/fitbit',function(req, res) {
	console.log('in fitbit...');
	fitObj.authorize(req, res);
    });
    
    router.get('/fitbit_auth_callback',function(req, res, next) {
	fitObj.oauthCallback(req, res, next);
    });
    
    router.get('/fb-profile',function(req, res, next) {
	fitObj.getdata(req, res, next);
    });

    app.use('/fit',router);
}