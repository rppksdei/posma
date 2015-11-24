module.exports = function(app,express,isClinicOrSurgeon, isClinicAdmin){
    var router = express.Router();
    var pathwayController = require("./../controller/pathwayController");
    var pathwayObj = new pathwayController();
    
    /* GET users listing. */
    router.get('/',isClinicOrSurgeon, function(req, res, next) {
        pathwayObj.getlisting(req, res, next);
    });
    
    /* add Clinic listing. */
    router.post('/add',  function(req, res, next) {
        if(typeof req.body._id != "undefined"){
            pathwayObj.updatePathwayDetail(req, res, next);
        }else{
            pathwayObj.addPathway(req, res, next);
        }
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

    router.post('/detail', function(req, res){
        pathwayObj.getPathwayDetail(req, res);
    });
    
    app.use('/pathway',router);
}