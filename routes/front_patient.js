module.exports = function(app, express,supportCrossOriginScript){
    var router = express.Router();
    var patientFrontController = require("./../controller/frontpatientController");
    var patientFrontObj = new patientFrontController();
    var patientFrontController = require("./../controller/patientController");
    var adminpatientFrontObj = new patientFrontController();
    /*
    router.get('/patient_login', function(req, res){
        console.log('here with get');
        console.log(req);
        res.send("sdfdsf");
        //patientFrontObj.getPatientDetail(req, res);
    });*/
    console.log(supportCrossOriginScript);
    router.post('/login', supportCrossOriginScript, function(req, res){
        patientFrontObj.login(req, res, function(err, data){
            controlleronsole.log("test");
        });
    });
    router.get('/loggedout', supportCrossOriginScript, function(req, res, next) {
        patientFrontObj.loggedout(req, res, next);
    });
    router.post('/getPatient', supportCrossOriginScript, function(req, res, next) {
        //res.json({'msg':'HELLEIO'});
        patientFrontObj.getDetail(req, res, next);
    });
    router.post('/update', supportCrossOriginScript, function(req, res, next) {
        //res.json({'msg':'HELLEIO'});
	//console.log('req=',req.body);
        adminpatientFrontObj.updatePatientDetail(req, res, next);
    });

    /* add Patient Answers. */
    router.post('/saveans', supportCrossOriginScript, function(req, res, next) {
        patientFrontObj.savePatientAns(req, res, next);
    });

    app.use('/front_patient',router);
}
