var stateModel = require("./../model/stateModel");
var fs = require("./../node_modules/fs-extra");
var common = require('./../common.js');
var Converter = require("csvtojson").Converter;
var converter = new Converter({});

readCsv = function(req, res, next){
    //end_parsed will be emitted once parsing finished 
    converter.on("end_parsed", function (jsonArray) {
         //here is your result jsonarray 
        var i = 0;j = 0;
        var stateData = new Array();
        for(i; i< jsonArray.length; i++){
            if(stateData.indexOf(jsonArray[i].state) < 0){
                stateData[j] = jsonArray[i].state;
                j++;
            }
        }
        var  cnt = 0;
        var saveData = new Array();
        for(var k =0; k < stateData.length; k++){
            var citiedArr = new Array();
            var o = 0;
            var finalData = {};
            for(var l= 0; l< jsonArray.length; l++){
                if(jsonArray[l].state == stateData[k]){
                    var cityDetail = {};
                    cityDetail.city = jsonArray[l].city;
                    //cityDetail.state = jsonArray[l].state;
                    cityDetail.zip = jsonArray[l].zip;
                    cityDetail.lat = jsonArray[l].lat;
                    cityDetail.lng = jsonArray[l].lng;
                    citiedArr[o] = cityDetail;
                    o++;
                }
            }
            finalData.state = stateData[k];
            finalData.cities = citiedArr;
            saveData[cnt] = finalData;
            //console.log('Cities ---',stateData[k],'======',citiedArr);
            cnt++;
        }
        //console.log(saveData);
        for(var x=0; x < saveData.length; x++){
            console.log(saveData[0]);
            stateModel.addState(saveData[x], function(err, data){
                /*var return_data = {};
                if (err) {
                    return_data.error = err;
                    res.json(return_data);
                } else{
                    return_data.success = true;
                    var frm = 'Ramanpreet ✔ <raman411@gmail.com>';
                    var emailSubject = 'Welcom to Post Operative System Management';
                    var emailTemplate = 'registration.html';
                    emailService.send(userDetails,emailSubject,emailTemplate,frm);
                    res.json(return_data);
                }*/
                
            });
        }
    });
     
    //read from file 
    require("fs").createReadStream("./controller/cities.csv").pipe(converter);

    
}

getAllStates = function(req, res, next){
    stateModel.getAll(req.body,{'_id':1,'state':1,'cities':1}, function(err, data){
        var return_data = {};
        if (err) {
            res.json('\nNot Inserted:-');
        } else{
            var resdata = {}
            for(var y = 0; y < data.length; y++){
                resdata[data[y].state] = data[y];
            }
            res.json(resdata);
        }
    });
}

module.exports = function(){
    this.readCsv = readCsv;
    this.getAllStates = getAllStates;
}