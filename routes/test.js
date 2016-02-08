module.exports = function(app,express){
    var router = express.Router();
    console.log('here I am');
    /* GET users listing. */
    router.post('/',  function(req, res, next) {
        console.log(d.getTimezoneOffset());
    });
    
    
    app.use('/test',router);
}