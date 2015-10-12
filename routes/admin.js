module.exports = function(app,express, isSuperAdmin){
    var router = express.Router();
    var adminController = require("./../controller/adminController");
    var adminObj = new adminController();
    
    /* GET users listing. */
    router.get('/',  function(req, res, next) {
        adminObj.getlisting(req, res, next);
    });
    
    /* add Admin/Clinic listing. */
    router.post('/add', isSuperAdmin, function(req, res, next) {
        adminObj.addAdmin(req, res, next);
    });
    
    // Get One Admin/Clinic Detail
    router.get('/:id', function(req, res){
        adminObj.getAdminDetail(req, res);
    });
    //End of code to get one Admin/Clinic detail
    
    // Get One Admin/Clinic Detail
    router.post('/update', function(req, res){
        adminObj.updateAdminDetail(req, res);
    });
    //End of code to get one Admin/Clinic detail
    
    app.use('/manage_admin',router);
}