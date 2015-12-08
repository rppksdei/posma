module.exports = function(app, express,supportCrossOriginScript){
    var router = express.Router();
    var patientFrontController = require("./../controller/frontpatientController");
    var patientFrontObj = new patientFrontController();
    /*
    router.get('/patient_login', function(req, res){
        console.log('here with get');
        console.log(req);
        res.send("sdfdsf");
        //patientFrontObj.getPatientDetail(req, res);
    });*/

    router.post('/login', supportCrossOriginScript, function(req, res){
        patientFrontObj.login(req, res, function(err, data){
            controlleronsole.log("test");
        });
    });


    router.get('/loggedout',  function(req, res, next) {
        patientFrontObj.loggedout(req, res, next);
    });
    
    /* add Patient Answers. */
    router.post('/saveans', supportCrossOriginScript, function(req, res, next) {
        //patientObj.updatePatientDetail(req, res, next);
        patientFrontObj.savePatientAns(req, res, next);
    });

    app.use('/front_patient',router);
}
