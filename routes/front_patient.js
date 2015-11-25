module.exports = function(app, express){
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
    function supportCrossOriginScript(req, res, next) {
        console.log('RAMAN',req.method);
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
        res.header("Access-Control-Allow-Credentials", true);
        next();
    }

    router.post('/login', supportCrossOriginScript, function(req, res){
        console.log('==========================================================================================');
        console.log('here with post');
        console.log(req.body);
        //patientFrontObj.login(req, res);
        console.log(patientFrontObj);
        patientFrontObj.login(req, res, next);
    });
    app.use('/front_patient',router);
}