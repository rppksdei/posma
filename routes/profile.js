module.exports = function(app,express, isLoggedIn){
    var router = express.Router();
    var profileController = require("./../controller/profileController");
    var profileObj = new profileController();
    
    // Get One Admin/Clinic Detail
    router.get('/detail', isLoggedIn, function(req, res){
        profileObj.getUserDetail(req, res);
    });
    //End of code to get one Admin/Clinic detail
    
    // Get One Admin/Clinic Detail
    router.post('/update', function(req, res){
        profileObj.updateUserDetail(req, res);
    });
    //End of code to get one Admin/Clinic detail
    
    router.post('/change_password', function(req, res){
        profileObj.changePassword(req,res);
    });
    
    app.use('/profile',router);
}