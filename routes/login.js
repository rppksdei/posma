module.exports = function(app,express){
    var router = express.Router();
    var loginController = require("./../controller/loginController");
    
    /* GET users listing. */
    router.post('/',  function(req, res, next) {
        loginController.userlogin(req, res, next);
    });
    
    router.get('/checkloggedin',  function(req, res, next) {
        loginController.checkloggedin(req, res, next);
    });
    
    router.get('/loggedout',  function(req, res, next) {
        loginController.loggedout(req, res, next);
    });
    app.use('/login',router);
}