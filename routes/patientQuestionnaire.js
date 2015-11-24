module.exports = function(app,express){
    var router = express.Router();
    var patQuestController = require("./../controller/patQuestController");
    var patQuestObj = new patQuestController();
    
    /* GET users listing. */
    router.get('/',  function(req, res, next) {
        patQuestObj.getlisting(req, res, next);
    });
    
    /* add Questionnaire listing. */
    router.post('/add',  function(req, res, next) {
        patQuestObj.addQuestionnaire(req, res, next);
    });
    
    // Get One Questionnaire Detail
    router.get('/:id', function(req, res){
        patQuestObj.getQuestionnaireDetail(req, res);
    });
    //End of code to get one Questionnaire detail
    
    // Get One Questionnaire Detail
    router.post('/update', function(req, res){
        patQuestObj.updateQuestionnaireDetail(req, res);
    });
    //End of code to get one Questionnaire detail
    
    app.use('/patient_questionnaire',router);
}