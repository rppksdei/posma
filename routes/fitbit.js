module.exports = function(app,express,supportCrossOriginScript){
    var router              = express.Router();
    //var fitbitController    = require("./../controller/fitbitController");
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
    
    router.post('/authorize',supportCrossOriginScript,function(req, res, next) {
	//console.log('in authorize... = ', req.body, req.params, req.query);
	//res.json({'data': 'Working'});
	console.log('-post request-')
	fitObj.authorize(req, res, next);
    });
    
    router.get('/fitbit_auth_callback',function(req, res, next) {
	console.log('in fitbit_auth_callback... = ', req.body, req.params, req.query);
	fitObj.oauthCallback(req, res, next);
    });
    
    router.get('/getHR',supportCrossOriginScript,function(req, res, next) {
	fitObj.getHR(req, res, next);
    });
    
    router.get('/getFitbitData',supportCrossOriginScript,function(req, res, next) {
	fitObj.getFitbitData(req, res, next);
    });

    app.use('/fitbit',router);
}
