module.exports = function(app,express){
    var router = express.Router();
    var questionnaireController = require("./../controller/questionnaireController");
    var questionnaireObj = new questionnaireController();
    
    /* GET Questionnaire listing. */
    router.get('/',  function(req, res, next) {
        questionnaireObj.getlisting(req, res, next);
    });
    
    /* add Questionnaire listing. */
    router.post('/add',  function(req, res, next) {
        questionnaireObj.addQuestionnaire(req, res, next);
    });
    // Get One Questionnaire Detail
    router.post('/getDetail', function(req, res){
        questionnaireObj.getQuestionnaireDetail(req, res);
    });
    //End of code to get one Questionnaire detail
    
    // Get One Questionnaire Detail
    router.post('/update', function(req, res){
        questionnaireObj.updateQuestionnaireDetail(req, res);
    });
    //End of code to get one Questionnaire detail
    
    app.use('/questionnaire',router);
}