module.exports = function(app,express,isClinicOrSurgeon, isClinicAdmin){
    var router = express.Router();
    var surgeryController = require("./../controller/surgeryController");
    var surgeryObj = new surgeryController();
    
    /* GET Surgery listing. */
    router.get('/', isClinicOrSurgeon,  function(req, res, next) {
       surgeryObj.getlisting(req, res, next);
    });
    
    /* add Surgery listing. */
    router.post('/add', isClinicAdmin, function(req, res, next) {
        if(typeof req.body._id != "undefined"){
            surgeryObj.updateSurgeryDetail(req, res, next);
        }else{
            surgeryObj.addSurgery(req, res, next);
        }
    });
    
    // Get One Surgery Detail
    // router.post('/:id', function(req, res){
    //     //console.log('fgdfg');
    //     surgeryObj.getSurgeryDetail(req, res);
    // });
    //End of code to get one Surgery detail

    router.post('/detail', isClinicOrSurgeon, function(req, res){
        surgeryObj.getSurgeryDetail(req, res);
    });
    
    // Update Surgery
    router.post('/update', isClinicAdmin, function(req, res){
        surgeryObj.updateSurgeryDetail(req, res);
    });
    //End of code to get one Surgery detail

    // Get Surgery Detail By Clinic
    /*
    router.post('/get_surgery_by_clinic', isClinicOrSurgeon, function(req, res, next){
        surgeryObj.getSurgeryByClinic(req, res, next);
    });
    */
    
    app.use('/surgery',router);
}