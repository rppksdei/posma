module.exports = function(app,express){
    var router = express.Router();
    var questionnaireController = require("./../controller/questionnaireController");
    var questionnaireObj = new questionnaireController();
    
    /* GET Surgery listing. */
    router.get('/',  function(req, res, next) {
        questionnaireObj.getlisting(req, res, next);
    });
    
    /* add Surgery listing. */
    router.post('/add',  function(req, res, next) {
        questionnaireObj.addQuestionnaire(req, res, next);
    });
    
    // Get One Surgery Detail
    router.get('/:id', function(req, res){
        questionnaireObj.getQuestionnaireDetail(req, res);
    });
    //End of code to get one Surgery detail
    
    // Get One Surgery Detail
    router.post('/update', function(req, res){
        questionnaireObj.updateQuestionnaireDetail(req, res);
    });
    //End of code to get one Surgery detail
    
    app.use('/questionnaire',router);
}