module.exports = function(app,express){
    var router = express.Router();
    var cronController = require("./../controller/cronController");
    var cronObj = new cronController();
    
    //router.get('/detail', function(req, res, next){
    /*setInterval(
    	router.get('/detail', function(req, res){
    		console.log('Ramanpreet');
        	cronObj.getlisting(req, res);
    	}), 6000);*/
    setInterval(function(){ 
		//req = {};res = {};
		console.log('Cron Job');
		cronObj.getlisting();
    },600000);

    /*router.get('/detail', function(req, res){
		console.log('Ramanpreet');
    	cronObj.getlisting(req, res);
    	// cronObj.amit(req, res, next);
	})*/

    app.use('/cron',router);
}
