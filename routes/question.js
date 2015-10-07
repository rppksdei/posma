module.exports = function(app,express){
    var router = express.Router();
    var questionController = require("./../controller/questionController");
    var questionObj = new questionController();
    
    /* GET Surgery listing. */
    router.get('/',  function(req, res, next) {
        console.log("Get list of Question");
        questionObj.getlisting(req, res, next);
    });
    
    /* add Surgery listing. */
    router.post('/add',  function(req, res, next) {
        questionObj.addQuestion(req, res, next);
    });
    
    // Get One Surgery Detail
    router.get('/:id', function(req, res){
        questionObj.getQuestionDetail(req, res);
    });
    //End of code to get one Surgery detail
    
    // Get One Surgery Detail
    router.post('/update', function(req, res){
        questionObj.updateQuestionDetail(req, res);
    });
    //End of code to get one Surgery detail
    
    app.use('/question',router);
}