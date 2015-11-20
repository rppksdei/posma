module.exports = function(app,express, isSuperAdmin, isClinicOrAdmin, emailService){
    var router = express.Router();
    var adminController = require("./../controller/adminController");
    var adminObj = new adminController();

    console.log(emailService);
    
    /* GET users listing. */
    router.get('/', isClinicOrAdmin, function(req, res, next) {
        adminObj.getlisting(req, res, next);
    });
    
    /* add Admin/Clinic listing. */
    router.post('/add', isClinicOrAdmin, function(req, res, next) {
        adminObj.addAdmin(req, res,emailService, next);
    });
    
    // Get One Admin/Clinic Detail
    router.post('/detail', function(req, res){
        adminObj.getAdminDetail(req, res);
    });
    // Get One Admin/Clinic Detail
    router.get('/emailUser', function(req, res){
        adminObj.emailUser(req, res, emailService);
    });
    //End of code to get one Admin/Clinic detail
    
    // Get One Admin/Clinic Detail
    router.post('/update', function(req, res){
        adminObj.updateAdminDetail(req, res,emailService);
    });
    //End of code to get one Admin/Clinic detail
    
    app.use('/manage_admin',router);
}