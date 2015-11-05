module.exports = function(app,express,isClinicAdmin){
    var router = express.Router();
    var questionController = require("./../controller/questionController");
    var questionObj = new questionController();
    
    /* GET Question listing. */
    router.get('/',isClinicAdmin,  function(req, res, next) {
        console.log("Get list of Question");
        questionObj.getlisting(req, res, next);
    });

    router.post('/',isClinicAdmin,  function(req, res, next) {
        console.log("Get list of Questionssssa");
        questionObj.getlisting(req, res, next);
    });
    
    /* add Question listing. */
    router.post('/add',isClinicAdmin,  function(req, res, next) {
        questionObj.addQuestion(req, res, next);
    });
    
    // Get One Question Detail
    router.post('/getDetail', function(req, res){
       
        questionObj.getQuestionDetail(req, res);
    });
    //End of code to get one Question detail
    
    // Get One Question Detail
    router.post('/update',isClinicAdmin, function(req, res){
        questionObj.updateQuestionDetail(req, res);
    });
    //End of code to get one Question detail
    
    app.use('/question',router);
}