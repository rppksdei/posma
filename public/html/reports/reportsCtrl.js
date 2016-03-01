myapp.controller('reportsCtrl', function($scope, $route, Report, $location, Flash, ngTableParams, $rootScope, $routeParams, moment) {
    $scope.error_message = "";
    var rec_cnt = 6;
    var flag = '';
    $scope.patientanss = {};
    $scope.csv_data = new Array();

    if (typeof $route.current.$$route.flag !== 'undefined') {
        flag = $route.current.$$route.flag;
    }
    $scope.getHeader = function () {return ["Username", 
        "Patient Name",
        "DOB",
        "Date of Surgery",
        "BMI",
        "Date of Discharge",
        "Surgery",
        "Questionnaire",
        "Questionnaire Filled At",
        "CCI",
        "Dx",
        "Clinical T Stage",
        "Clinical N Stage",
        "Clinical M Stage",
        "Pathologic T Stage",
        "Pathologic N Stage",
        "Pathologic M Stage",
        "Neoadjuvant Chemotherapy",
        "Tumor Laterality",
        "Tumor Size",
        "# Clavien minor complications",
        "# Clavien major complications",
        "EBL",
        "Admission eGFR",
        "Admission Hemoglobin",
        "Discharge eGFR",
        "Discharge Hemoglobin",
        "Blood Transfusion"
    ]};

    $scope.list = function(){
        //Report.list().save({'search':'','limit':2}, function(data){
        Report.list().query(function(data){
            if(data){
                $scope.patientanss = data;
                var j = 0;
                for (var i = 0; i < data.length; i++) {
                    //console.log($scope.patientanss[i].patient_surgery);
                    if(typeof data[i].patient.date_of_birth == 'number') {
                        $scope.patientanss[i].patient.date_of_birth     = moment.unix(data[i].patient.date_of_birth).format('MMM DD, YYYY');
                    } else {
                        $scope.patientanss[i].patient.date_of_birth = 'Invalid date';
                    }
                    if(typeof data[i].patient.dos == 'number') {
                        $scope.patientanss[i].patient.dos     = moment.unix(data[i].patient.dos).format('MMM DD, YYYY');
                    } else {
                        $scope.patientanss[i].patient.dos = 'Invalid date';
                    }
                    if(typeof data[i].patient.dohd == 'number') {
                        $scope.patientanss[i].patient.dohd = moment.unix(data[i].patient.dohd).format('MMM DD,YYYY hh:mm A');
                    } else {
                        $scope.patientanss[i].patient.dohd = 'Invalid date';
                    }
                    if(typeof data[i].created == 'number') {
                        $scope.patientanss[i].created = moment.unix(data[i].created).format('MM/DD/YYYY hh:mm A');
                    } else {
                        $scope.patientanss[i].created = 'Invalid date';
                    }
                    $scope.csv_data[j] = {};
                    var row_data = {};

                    row_data.username                 = data[i].patient.username;
                    row_data.pname                    = data[i].patient_first_name +' '+ data[i].patient_last_name;
                    row_data.date_of_birth            = data[i].patient.date_of_birth;
                    row_data.dos                      = data[i].patient.dos;
                    row_data.bmi                      = data[i].patient.bmi;
                    row_data.dohd                     = data[i].patient.dohd;
                    row_data.surgery                  = data[i].patient_surgery;
                    row_data.questionnaire_name       = data[i].questionnaire_name;
                    row_data.created                  = data[i].created;
                    //row_data.time_of_discharge        = data[i].patient.time_of_discharge;
                    row_data.cci                      = data[i].patient.cci;
                    row_data.dx                       = data[i].patient.dx;
                    row_data.clinicalTstage           = data[i].patient.clinicalTstage;
                    row_data.clinicalNstage           = data[i].patient.clinicalNstage;
                    row_data.clinicalMstage           = data[i].patient.clinicalMstage;
                    row_data.pathologicTstage         = data[i].patient.pathologicTstage;
                    row_data.pathologicNstage         = data[i].patient.pathologicNstage;
                    row_data.pathologicMstage         = data[i].patient.pathologicMstage;
                    row_data.neoadjuvant_chemotherapy = data[i].patient.neoadjuvant_chemotherapy;
                    row_data.tumor_laterality         = data[i].patient.tumor_laterality;
                    row_data.size_of_tumor            = data[i].patient.size_of_tumor;
                    row_data.clavien_minor_no         = data[i].patient.clavien_minor_no;
                    row_data.clavien_major_no         = data[i].patient.clavien_major_no;
                    row_data.sbl                      = data[i].patient.sbl;
                    row_data.admission_egfr           = data[i].patient.admission_egfr;
                    row_data.admission_hemoglobin     = data[i].patient.admission_hemoglobin;
                    row_data.degfr                    = data[i].patient.degfr;
                    row_data.discharge_hemoglobin     = data[i].patient.discharge_hemoglobin;
                    row_data.blood_transfusion        = data[i].patient.blood_transfusion;
                    //j++;
                    for(var k = 0; k < data[i].questionDetails.length; k++) {
                        row_data['question'+k]                 = data[i].questionDetails[k].name;
                        var ans_txt = '';
                        if( (data[i].questionDetails[k].answer_type == 'rb') || 
                            (data[i].questionDetails[k].answer_type == 'cb') || 
                            (data[i].questionDetails[k].answer_type == 'dd')
                        ){
                            for(var l = 0; l < data[i].questionDetails[k].answer.length; l++) {
                                if(ans_txt != ""){
                                    ans_txt = ans_txt + ', ' + data[i].questionDetails[k].answer[l].name;
                                } else {
                                    ans_txt = data[i].questionDetails[k].answer[l].name;
                                }
                            }
                        } else if(data[i].questionDetails[k].answer_type == 'number'){
                            for(var ques_cnt = 0; ques_cnt < data[i].questions.length; ques_cnt++){
                                if(data[i].questionDetails[k]._id == data[i].questions[ques_cnt].question){
                                    ans_txt = data[i].questions[ques_cnt].answer;
                                }
                            }
                        } else if(data[i].questionDetails[k].answer_type == 'text'){
                            for(var ques_cnt = 0; ques_cnt < data[i].questions.length; ques_cnt++){
                                if(data[i].questionDetails[k]._id == data[i].questions[ques_cnt].question){
                                    ans_txt = data[i].questions[ques_cnt].answer;   
                                } 
                            }
                        }
                        row_data['ans'+k]                      = ans_txt;
                        $scope.csv_data[j] = row_data;
                    }
                    j++;
                } 
                $scope.tableParams = new ngTableParams({count:rec_cnt}, {counts:{}, data:$scope.patientanss});
            }
            
        });
    }

    $scope.abc = function(pname,questnnaire){
        var p_name = '';
        var quesnn = '';
        if(typeof pname != 'undefined'){
            p_name = pname;
        }
        if(typeof questnnaire != 'undefined'){
            quesnn = questnnaire;
        }
        if(p_name != "" || quesnn != ""){
            //alert(pname+'-----'+questnnaire);
            //console.log($scope.csv_data);
        }
    }
    if (flag == "report") {
        $scope.list();
    }
});