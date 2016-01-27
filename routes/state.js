module.exports = function(app,express){
    var router = express.Router();
    var stateController = require("./../controller/stateController");
    var stateObj = new stateController();

    /* GET users listing. */
    router.get('/', function(req, res, next) {
        stateObj.readCsv(req, res, next);
    });
    router.post('/getstates', function(req, res, next) {
        stateObj.getAllStates(req, res, next);
    });

    app.use('/states',router);
}