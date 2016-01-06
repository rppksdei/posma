module.exports = function(app,express, isClinicOrAdmin){
    var router = express.Router();
    var alertController = require("./../controller/alertsController");
    var alertObj = new alertController();
    /* GET users listing. */
    router.get('/',isClinicOrAdmin, function(req, res, next) {
        alertObj.getlisting(req, res, next);
    });
    
    
    app.use('/alerts',router);
}