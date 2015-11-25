module.exports = function(app, express){
    var router = express.Router();
    //var patientController = require("./../controller/patientController");
    var patientFrontObj = new patientController();
    /*
    router.get('/patient_login', function(req, res){
        console.log('here with get');
        console.log(req);
        res.send("sdfdsf");
        //patientFrontObj.getPatientDetail(req, res);
    });*/
    function supportCrossOriginScript(req, res, next) {
        console.log(req.method);
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
        res.header("Access-Control-Allow-Credentials", true);
        next();
    }

    router.post('/login', supportCrossOriginScript, function(req, res){
        console.log('===================================================================================================');
        console.log('here with post');
        console.log(req.body);
        res.send("received");
       // patientFrontObj.getPatientDetail(req, res);
    });
    app.use('/front_patient',router);
}