module.exports = function(app,express){
    var router = express.Router();
    var patientController = require("./../controller/patientController");
    var patientObj = new patientController();
    
    /* GET users listing. */
    router.get('/',  function(req, res, next) {
        patientObj.getlisting(req, res, next);
    });
    
    /* add Clinic listing. */
    router.post('/add',  function(req, res, next) {
        patientObj.addPatient(req, res, next);
    });
    
    // Get One Clinic Detail
    router.get('/:id', function(req, res){
        patientObj.getPatientDetail(req, res);
    });
    //End of code to get one clinic detail
    
    // Get One Clinic Detail
    router.post('/update', function(req, res){
        patientObj.updatePatientDetail(req, res);
    });
    //End of code to get one clinic detail

    
    
    app.use('/patient',router);
}