module.exports = function(app,express){
    var router = express.Router();
    var cronController = require("./../controller/cronController");
    var cronObj = new cronController();
    

    router.get('/detail', function(req, res){
        cronObj.getlisting(req, res);
    });
    
    app.use('/cron',router);
}
