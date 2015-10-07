module.exports = function(app,express){
    var router = express.Router();
    var profileController = require("./../controller/profileController");
    var profileObj = new profileController();
    
    // Get One Admin/Clinic Detail
    router.get('/detail', function(req, res){
        profileObj.getUserDetail(req, res);
    });
    //End of code to get one Admin/Clinic detail
    
    // Get One Admin/Clinic Detail
    router.post('/update', function(req, res){
        profileObj.updateUserDetail(req, res);
    });
    //End of code to get one Admin/Clinic detail
    
    app.use('/profile',router);
}