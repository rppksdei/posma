module.exports = function(app,express,supportCrossOriginScript){
    var router = express.Router();
    var notificationController = require("./../controller/notificationController");
    var notificationObj = new notificationController();

    router.post('/', supportCrossOriginScript,  function(req, res, next) {
       notificationObj.getNotification(req, res, next);
    });

    router.post('/getQuestionnaire', supportCrossOriginScript,  function(req, res, next) {
       notificationObj.getQuestionnaire(req, res, next);
    });
    
    app.use('/notification',router);
}
