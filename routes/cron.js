module.exports = function(app,express){
    var router = express.Router();
    var cronController = require("./../controller/cronController");
    var cronObj = new cronController();
    

    router.post('/detail', function(req, res, next){
        cronObj.getlisting(req, res);
        // cronObj.amit(req, res, next);
    });
    
    app.use('/cron',router);
}