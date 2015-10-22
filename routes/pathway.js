module.exports = function(app,express){
    var router = express.Router();
    var pathwayController = require("./../controller/pathwayController");
    var pathwayObj = new pathwayController();
    
    /* GET users listing. */
    router.get('/',  function(req, res, next) {
        pathwayObj.getlisting(req, res, next);
    });
    
    /* add Clinic listing. */
    router.post('/add',  function(req, res, next) {
        pathwayObj.addPathway(req, res, next);
    });
    
    // Get One Clinic Detail
    router.get('/:id', function(req, res){
        pathwayObj.getPathwayDetail(req, res);
    });
    //End of code to get one clinic detail
    
    // Get One Clinic Detail
    router.post('/update', function(req, res){
        pathwayObj.updatePathwayDetail(req, res);
    });
    //End of code to get one clinic detail

    /* GET users listing. 
    router.post('/getpathway',  function(req, res, next) {
        pathwayObj.getpathway(req, res, next);
    });
    */
    
    app.use('/pathway',router);
}