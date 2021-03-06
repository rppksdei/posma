module.exports = function(app,express, isClinicOrAdmin){
    var router = express.Router();
    var alertController = require("./../controller/alertsController");
    var alertObj = new alertController();
    /* GET users listing. */
    router.get('/',isClinicOrAdmin, function(req, res, next) {
        alertObj.getlisting(req, res, next);
    });
    //router.post('/getDetail', function(req, res, next){
    router.post('/alertDetail', function(req, res, next){
        console.log('---------------Routes------------');
        alertObj.getDetail(req, res, next);
    });
    router.post('/add_notes', function(req, res){
        alertObj.addNotes(req, res);
    });
    router.post('/update', function(req, res){
        alertObj.updateAlert(req, res);
    });
    /*router.post('/getPatientalert', function(req, res){
        alertObj.getAlert(req, res);
    });*/

    
    app.use('/alerts',router);
}