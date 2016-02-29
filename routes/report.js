module.exports = function(app,express, isClinicOrAdmin){
    var router = express.Router();
    var reportController = require("./../controller/reportController");
    var reportObj = new reportController();
    /* GET users listing. */
    //router.post('/',isClinicOrAdmin, function(req, res, next) {
    router.get('/',isClinicOrAdmin, function(req, res, next) {
        reportObj.getlisting(req, res, next);
    });
    
    app.use('/reports',router);
}