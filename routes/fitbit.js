module.exports = function(app,express){
    var router              = express.Router();
    var fitbitController    = require("./../controller/fitbitController");
    var fitObj              = new fitbitController();

    // OAuth flow
    router.get('/',function(req, res, next) {
	fitObj.createAPI(req, res, next);
    });
    
    // On return from the authorization
    router.get('/oauth_callback',function(req, res, next) {
	fitObj.oauthCallback(req, res, next);
    });
    
    // Display some stats
    router.get('/stats',function(req, res) {
	fitObj.getStats(req, res);
    });
    
    /*
    router.post('/gcmsend',function(req, res, next) {
	gcmObj.sendToAndroid();
    });
    */

    app.use('/fitbit',router);
}
