module.exports = function(app,express){
    var router = express.Router();
    var cronController = require("./../controller/cronController");
    var cronObj = new cronController();
    /* router.get('/detail', function(req, res, next){ */
    setInterval(function(){ 
		//console.log('Cron Job');
		cronObj.getlisting();
    },60000); // 5 0s
    setInterval(function(){ 
		//console.log('Cron Patient Answers');
		cronObj.updatePatientAnswers();
    },10000); // 5 0s

    app.use('/cron',router);
}
