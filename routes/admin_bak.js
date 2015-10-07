module.exports = function(app,express){
    var router = express.Router();
    var adminController = require("./../controller/adminController");
    
    /* GET users listing. */
    router.post('/editprofile',  function(req, res, next) {
        adminController.editprofile(req, res, next);
    });
    app.use('/admin',router);
}