var patientModel = require("./../model/patientModel");
var questionnaireModel = require("./../model/questionnaireModel");
var notificationModel = require("./../model/notificationModel");
var moment = require('moment');

var pc = 0; /* pc = no. of discharged patients count . */
var testvar = 0; var resdata = {}; var patient_data = [];


/* callback functions for incrementing and to get questionnaire details */
cbTofindQuestionnaires = function(patientsData,query,length,currentIndex){    
    // console.log("\ncurrentIndex = ",currentIndex);
    // console.log('//\n',patientsData[currentIndex]);
    var search_questionnaier = {_id:{$in:patientsData[currentIndex].pathway.questionnaire}};
    var params = {name:1,type:1,execute_time:1,recur_type:1,time_slots:1,start_day:1,total_days:1,days:1,};
    questionnaireModel.find(search_questionnaier, params, function(err, qdata){
        // console.log('.........................Qdata...........................\n',qdata);
        if(qdata.length > 0){
            // var pdd1 = new Date(patientsData[currentIndex].dohd);
            // var pdd2 = moment.utc(patientsData[currentIndex].dohd, 'X').utcOffset('+0530').format('YYYY-MM-DD HH:mm:ss');
            var pdd3 = moment.unix(patientsData[currentIndex].time_of_discharge);
            var pdd = pdd3._d; // full date format e.g.{Wed Nov 25 2015 11:53:18 GMT+0530 (IST)}
            // console.log('pdd = ', pdd);
            // console.log(query);
            // var pdd4 = moment.utc(patientsData[currentIndex].dohd, 'X').format();
            var tempVals = new Array(); var cnt = 0; 
            for(var j=0; j<qdata.length; j++){
                var tempObj = {};
                if(qdata[j].type=='single'){
                    // var execution_time = addHours(pdd, qdata[j].execute_time);
                    var execution_time = moment(pdd).add(qdata[j].execute_time, 'h').unix();//addHours
                    // var nd = moment.utc(execution_time, 'X').format('YYYY-MM-DD');
                    // console.log('single execution_time = ',execution_time);
                    if(execution_time < query.endTimeStamp){
                    // if((execution_time >= query.currentTimeStamp) && (execution_time < query.endTimeStamp)){
                        tempObj.datetime 			= execution_time;
                        tempObj.questionnaire 		= qdata[j]._id;
                        tempObj.questionnaire_name 	= qdata[j].name;
                        tempVals[cnt++] = tempObj;
                        // tempVals[cnt++] = qdata[j];
                    }
                }
                else if(qdata[j].type=='recursive'){
                    var recur_execut_date       = moment(pdd).add(qdata[j].start_day, 'd');//addDays;
                    var recur_execut_date_full  = recur_execut_date.format(); // full date
                    var recur_execut_date_ts    = moment(recur_execut_date).unix();
                    var recur_execut_end_date   = moment(recur_execut_date_full).add(qdata[j].total_days, 'd');//addDays;
                    var recur_execut_end_date_full  = recur_execut_end_date.format(); // full date
                    var recur_execut_end_date_ts  = moment(recur_execut_end_date).unix();
                    var current_day = moment.unix(query.currentTimeStamp).format('E');
                    // console.log('current_day = ',current_day);
                    var current_date = moment.unix(query.currentTimeStamp);
                    /*
                    // console.log('1 = ', recur_execut_date);
                    console.log('2 = ', recur_execut_date_full); // e.g {2015-11-26T11:53:18+05:30}
                    console.log('3 = ', recur_execut_date_ts); // 1448518998
                    // console.log('4 = ', recur_execut_end_date); // 
                    console.log('5 = ', recur_execut_end_date_full); // {2015-12-03T11:53:18+05:30}
                    console.log('currentTimeStamp', query.currentTimeStamp);
                    console.log('endTimeStamp', query.endTimeStamp);
                    */
                    var is_time_slot_in = false;
                    if(qdata[j].recur_type == 'd'){
                        if((query.currentTimeStamp >= recur_execut_date_ts) && (query.currentTimeStamp < recur_execut_end_date_ts)){
                            if(qdata[j].time_slots.length > 0){
                                for (var k = 0; k < qdata[j].time_slots.length; k++) {
                                    var newD = moment(current_date.format('YYYY-MM-DD')+' '+qdata[j].time_slots[k]).unix();
                                    // console.log('\nnewD...daily',newD);
                                    if((newD >= query.currentTimeStamp) && (newD < query.endTimeStamp)){
                                        is_time_slot_in = true;
                                        tempObj.datetime = newD;
                                        break;
                                        // qdata[j].datetime = newD;
                                    }
                                };
                                // console.log('is_time_slot_in daily = ',is_time_slot_in);
                                if(is_time_slot_in==true){
                                    tempObj.questionnaire 		= qdata[j]._id;
                                    tempObj.questionnaire_name 	= qdata[j].name;
                                    tempVals[cnt++] = tempObj;
                                    // tempVals[cnt++] = qdata[j];
                                }
                            }
                        }
                    }else if(qdata[j].recur_type == 'w'){
                        if(qdata[j].days.indexOf(current_day) >= 0){
                            if((query.currentTimeStamp >= recur_execut_date_ts) && (query.currentTimeStamp < recur_execut_end_date_ts)){
                                if(qdata[j].time_slots.length > 0){
                                    for (var k = 0; k < qdata[j].time_slots.length; k++) {
                                        var newD = moment(current_date.format('YYYY-MM-DD')+' '+qdata[j].time_slots[k]).unix();
                                        // console.log('\nnewD...weekly',newD);
                                        if((newD >= query.currentTimeStamp) && (newD < query.endTimeStamp)){
                                            is_time_slot_in = true;
                                            tempObj.datetime = newD;
                                        	break;
                                            // qdata[j].datetime = newD; // working here over getting execution time for inserting notification.
                                        }
                                    };
                                    // console.log('is_time_slot_in W = ',is_time_slot_in);
                                    if(is_time_slot_in==true){
                                        tempObj.questionnaire 		= qdata[j]._id;
                                        tempObj.questionnaire_name 	= qdata[j].name;
                                        tempVals[cnt++] = tempObj;
                                        // tempVals[cnt++] = qdata[j];
                                    }
                                }
                            }
                        }
                    }
                }
                if((j+1)==qdata.length){
                    // console.log('\ntempVals-----> ',tempVals);
                    patientsData[currentIndex].pathway.questionnaires = tempVals;
                }
            }
            if((currentIndex+1)==length){
                // console.log(patientsData);
                /*** add patients with related questionnaires into notifications table ***/
                if(patientsData.length > 0){
                    for(var l=0; l<patientsData.length; l++){
                        var notification_data = {};
                        
                        notification_data.patient       = patientsData[l]._id;
                        notification_data.message       = 'New Notification';
                        notification_data.created       = moment().unix();
                        notification_data.is_filled     = 0;

                        for(var m=0; m<patientsData[l].pathway.questionnaires.length; m++){
                        	notification_data.datetime      = patientsData[l].pathway.questionnaires[m].datetime;
                            notification_data.questionnaire = patientsData[l].pathway.questionnaires[m].questionnaire;
                            // console.log('\nnotification_data ==\n', notification_data);
                            notificationModel.add(notification_data, function(err2, ndata){
                            	if(err2){
                            		console.log('Notification add error : ',err2);
                            	}
                            	if(ndata){
                            		console.log('Notification add msg-- : ',ndata);
                            	}
                            });
                        }
                    }
                }
                //console.log(patientsData);
                //res.jsonp(patientsData);
            }
        }
    })
}

getlisting = function(){
    var search = {is_deleted:0, pathway:{$ne: null}};
    /*if (req.user.user_type == "2") {
        search.clinic = req.user.parent_id;
    }else if (req.user.user_type == "0"){
        search.clinic = req.user._id;
    }*/
    var pd = {};
    var current_date        = new Date();
    var currentTimeStamp    = moment().unix();
    var endTimeStamp        = addMinutes(current_date, 40);

    search.dohd = {$lte: currentTimeStamp};
    var patParams = {username:1,pathway:1,time_of_discharge:1};
    
    patientModel.getAllPatient(search, function(err, patientsData){
        if(err){
            console.log(err);
            //res.json(err);
        }
        else{
            //console.log('No. of Patients : ',patientsData.length);
            pd.currentTimeStamp  = currentTimeStamp;
            pd.endTimeStamp      = endTimeStamp;
            
            for(var i=0; i<patientsData.length; i++){
                cbTofindQuestionnaires(patientsData,pd,patientsData.length,i);
            }

        }
    });
}
/*
amit = function(req,res,next){
    var search = {is_deleted:0, pathway:{$ne: null}};
    
    var current_date        = new Date();
    var currentTimeStamp    = moment().unix();
    var endTimeStamp        = addMinutes(current_date, 40);

    search.dohd = {$lte: currentTimeStamp};
    patientModel.getAllPatient(search, function(err, patientsData){
        if(err){
            res.json(err);
        }
        else{
            for(var i=0; i<patientsData.length; i++){
                console.log(patientsData[i].pathway.questionnaire);
                cbTofindQuestionnaires(patientsData,patientsData.length,i,res);
            }
            //console.log(patientsData.length); return;
        }
    })
}
*/



addDays = function(d, days){
    var newdate = d.setDate(d.getDate()+days);
    return newdate;
}

addHours = function(d, h){
    var newdate = d.setHours(d.getHours()+h);
    return newdate;
}

addMinutes = function(d, mins) {
    var newdate = new Date(d.getTime() + mins*60000);
    return moment(newdate).unix();
}

timeToTimeStamp = function(myDate){
    myDate = myDate.split("/");
    var newDate = myDate[0]+"/"+myDate[1]+"/"+myDate[2];
    var dateTimeStamp = new Date(newDate).getTime();
    return dateTimeStamp;
}

getpatientDetail = function(req, res){
    var pathway_id = req.body.id;
    var search_pathway = {_id:pathway_id};
    //console.log(req);
    patientModel.getPathway(search_pathway, function(err, data){
        var return_val = {};
        if (err){
            return_val.error = err;
            res.json(return_val);
        }
        else{
            if (data == null) {
                return_val.error = "Pathway doesn't exists";
                res.json(return_val);
            }
            else{
                res.json(data);
            }
        }  
    });  
}

addPathway = function(req, res, next){
    var patientDetail = req.body;
    patientDetail.created       = Date.now();
    patientDetail.is_active     = 1;
    patientDetail.clinic        = req.user._id;
    patientModel.addPathway(patientDetail, function(err, data){
        var return_val = {};
        if (err) {
            var error_detail = [];
            // go through all the errors...
            for (var errName in err.errors) {
                error_detail.push(err.errors[errName].message);
            }
            return_val.error = error_detail;
            res.json(return_val);
        }
        else{
            return_val.success = "Pathway added Successfully";
            res.json(return_val);
        }
      //  res.json(return_val);
    });
}

updatepatientDetail = function(req, res){
    //Code to create JSON object data
    var update_data = {};
    //console.log(req.body);
    if(typeof req.body.name != "undefined"){
        update_data.name = req.body.name;
    }
    if(typeof req.body.description != "undefined"){
        update_data.description = req.body.description;
    }
    if(typeof req.body.surgery != "undefined"){
        update_data.surgery = req.body.surgery;
    }
    if(typeof req.body.clinic != "undefined"){
        update_data.clinic = req.body.clinic;
    }
    if(typeof req.body.questionnaire != "undefined"){
        update_data.questionnaire = req.body.questionnaire;
    }
    if(typeof req.body.is_deleted != "undefined"){
        update_data.is_deleted = req.body.is_deleted;
    }
    if(typeof req.body.is_active != "undefined"){
        update_data.is_active = req.body.is_active;
    }
    update_data.modified = Date.now();
    //End of code to create object data
    
    // Code to update clinic Details
    if(typeof req.body._id != "undefined"){
        var search_criteria = {};
        var search_criteria = {_id:req.body._id};
        patientModel.updatePathway(search_criteria, update_data, function(err, data){
            var return_data = {};
            var message = "";
            if (err) {
                if (err.errors) {
                    var error_detail = [];
                    for (var errName in err.errors) {
                        error_detail.push(err.errors[errName].message);
                    }
                    return_data.error = error_detail;
                    res.json(return_data);
                }
                else{
                    return_data.error = message;
                    res.json(return_data);
                }
            }
            else{
                return_data.success = "Pathway updated Successfully";
                res.json(return_data);
            }
        });
    }
    else{
        var return_data = {};
        return_data.error = "Please enter object id to update";
        res.json(return_data);
    }
    //End of code to update clinic detail
}



module.exports = function(){
    this.getlisting = getlisting;
    // this.amit = amit;
    this.getpatientDetail = getpatientDetail;
    this.addPathway = addPathway;
    this.updatepatientDetail = updatepatientDetail;
}


