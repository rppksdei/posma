module.exports = function(app,express){
    var router = express.Router();
    var surgeryController = require("./../controller/surgeryController");
    var surgeryObj = new surgeryController();
    
    /* GET Surgery listing. */
    router.get('/',  function(req, res, next) {
       surgeryObj.getlisting(req, res, next);
    });
    
    /* add Surgery listing. */
    router.post('/add',  function(req, res, next) {
        surgeryObj.addSurgery(req, res, next);
    });
    
    // Get One Surgery Detail
    router.get('/:id', function(req, res){
        surgeryObj.getSurgeryDetail(req, res);
    });
    //End of code to get one Surgery detail
    
    // Get One Surgery Detail
    router.post('/update', function(req, res){
        surgeryObj.updateSurgeryDetail(req, res);
    });
    //End of code to get one Surgery detail
    
    app.use('/surgery',router);
}