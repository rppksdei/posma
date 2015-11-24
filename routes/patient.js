module.exports = function(app, express, isClinicOrSurgeon, isClinicAdmin){
    var router = express.Router();
    var patientController = require("./../controller/patientController");
    var patientObj = new patientController();
    /*
    router.get('/patient_login', function(req, res){
        console.log('here with get');
        console.log(req);
        res.send("sdfdsf");
        //patientObj.getPatientDetail(req, res);
    });*/


    function supportCrossOriginScript(req, res, next) {
        console.log(req.method);
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
        res.header("Access-Control-Allow-Credentials", true);
        next();
    }

    router.post('/patient_login', supportCrossOriginScript, function(req, res){
        console.log('===================================================================================================');
        console.log('here with post');
        console.log(req.body);
        res.send("received");
       // patientObj.getPatientDetail(req, res);
    });
    /* GET users listing. */
    router.get('/',  function(req, res, next) {
        patientObj.getlisting(req, res, next);
    });
    /* add Clinic listing. */
    router.post('/add',  function(req, res, next) {
        if(typeof req.body._id != "undefined"){
            patientObj.updatePatientDetail(req, res, next);
        }else{
            patientObj.addPatient(req, res, next);
        }
    });
    // Get One Clinic Detail
    router.get('/:id', function(req, res){
        patientObj.getPatientDetail(req, res);
    });
    //End of code to get one clinic detail
    // Get One Clinic Detail
    /*router.post('/update', function(req, res){
        patientObj.updatePatientDetail(req, res);
    });*/
    //End of code to get one clinic detail
    router.post('/detail', function(req, res){
        patientObj.getPatientDetail(req, res);
    });
    app.use('/patient',router);
}