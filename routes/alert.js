module.exports = function(app,express, isClinicOrAdmin){
    var router = express.Router();
    var alertController = require("./../controller/alertsController");
    var alertObj = new alertController();
    /* GET users listing. */
    router.get('/',isClinicOrAdmin, function(req, res, next) {
        alertObj.getlisting(req, res, next);
    });
    router.post('/getDetail', function(req, res){
        alertObj.getAlert(req, res);
    });
    router.post('/add_notes', function(req, res){
        alertObj.addNotes(req, res);
    });
    
    app.use('/alerts',router);
}