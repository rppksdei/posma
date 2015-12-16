module.exports = function(app,express){
    var router = express.Router();
    var cronController = require("./../controller/cronController");
    var cronObj = new cronController();
    
    /* router.get('/detail', function(req, res, next){ */
    
    setInterval(function(){ 
	console.log('Cron Job');
	cronObj.getlisting();
    },600000); // 5 0s

    app.use('/cron',router);
}
