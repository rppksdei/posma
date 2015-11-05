module.exports = function(app,express,isClinicOrSurgeon, isClinicAdmin){
    var router = express.Router();
    var cronController = require("./../controller/cronController");
    var cronObj = new cronController();
    

    router.post('/detail', function(req, res){
        cronObj.getlisting(req, res);
    });
    
    app.use('/cron',router);
}