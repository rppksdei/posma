myapp.controller('reportsCtrl', function($scope, $route, Report, $location, Flash, ngTableParams, $rootScope, $routeParams, moment){
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
                        "BMI",
                        "Date of Discharge",
                        "Surgery",
                        "Questionnaire",
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
        Report.list().query({}, function(data){
            if(data){
                $scope.patientanss = data;
                var j = 0;
                for (var i = 0; i < data.length; i++) {
                    if(typeof data[i].dos == 'number'){
                        $scope.patientanss[i].dos     = moment.unix(data[i].dos).format('MM/DD/YYYY');
                    } else {
                        $scope.patientanss[i].dos = 'Invalid date';
                    }
                    if(typeof data[i].dohd == 'number'){
                        $scope.patientanss[i].dohd = moment.unix(data[i].dohd).format('MM/DD/YYYY HH:mm:ss');
                    } else {
                        $scope.patientanss[i].dohd = 'Invalid date';
                    }
                    //$scope.patients[i].dohd    = moment.unix(data[i].dohd).format('MM/DD/YYYY HH:mm:ss');
                    $scope.csv_data[j] = {};
                    $scope.csv_data[j].username                 = data[i].patient.username;
                    $scope.csv_data[j].pname                    = data[i].patient_first_name +' '+ data[i].patient_last_name;
                    $scope.csv_data[j].date_of_birth            = data[i].patient.date_of_birth;
                    $scope.csv_data[j].bmi                      = data[i].patient.bmi;
                    $scope.csv_data[j].dohd                     = data[i].patient.dohd;
                    $scope.csv_data[j].surgery                  = data[i].patient.surgery;


                    $scope.csv_data[j].questionnaire_name       = data[i].questionnaire_name;

                    //$scope.csv_data[j].time_of_discharge        = data[i].patient.time_of_discharge;
                    $scope.csv_data[j].cci                      = data[i].patient.cci;
                    $scope.csv_data[j].dx                       = 'Dx';
                    $scope.csv_data[j].clinicalTstage           = data[i].patient.clinicalTstage;
                    $scope.csv_data[j].clinicalNstage           = data[i].patient.clinicalNstage;
                    $scope.csv_data[j].clinicalMstage           = data[i].patient.clinicalMstage;
                    $scope.csv_data[j].pathologicTstage         = data[i].patient.pathologicTstage;
                    $scope.csv_data[j].pathologicNstage         = data[i].patient.pathologicNstage;
                    $scope.csv_data[j].pathologicMstage         = data[i].patient.pathologicMstage;
                    $scope.csv_data[j].neoadjuvant_chemotherapy = data[i].patient.neoadjuvant_chemotherapy;
                    $scope.csv_data[j].tumor_laterality         = data[i].patient.tumor_laterality;
                    $scope.csv_data[j].size_of_tumor            = data[i].patient.size_of_tumor;
                    $scope.csv_data[j].clavien_minor_no         = data[i].patient.clavien_minor_no;
                    $scope.csv_data[j].clavien_major_no         = data[i].patient.clavien_major_no;
                    $scope.csv_data[j].sbl                      = data[i].patient.sbl;
                    $scope.csv_data[j].aegfr                    = 'Admission eGFR';
                    $scope.csv_data[j].addimission_hemoglobin   = 'Admission Hemoglobin';
                    $scope.csv_data[j].degfr                    = data[i].patient.degfr;
                    $scope.csv_data[j].discharge_hemoglobin     = data[i].patient.discharge_hemoglobin;
                    $scope.csv_data[j].blood_transfusion     = data[i].patient.blood_transfusion;
                    j++;
                    for(var k = 0; k < data[i].questionDetails.length; k++){
                        $scope.csv_data[j] = {};
                        $scope.csv_data[j].username                 = '';
                        $scope.csv_data[j].pname                    = '';
                        $scope.csv_data[j].date_of_birth            = '';
                        $scope.csv_data[j].bmi                      = '';
                        $scope.csv_data[j].dohd                     = '';
                        $scope.csv_data[j].surgery                  = '';


                        $scope.csv_data[j].questionnaire_name       = '';
                        $scope.csv_data[j].time_of_discharge        = '';
                        $scope.csv_data[j].cci                      = '';
                        $scope.csv_data[j].dx                       = '';
                        $scope.csv_data[j].clinicalTstage           = '';
                        $scope.csv_data[j].clinicalNstage           = '';
                        $scope.csv_data[j].clinicalMstage           = '';
                        $scope.csv_data[j].pathologicTstage         = '';
                        $scope.csv_data[j].pathologicNstage         = '';
                        $scope.csv_data[j].pathologicMstage         = '';
                        $scope.csv_data[j].neoadjuvant_chemotherapy = '';
                        $scope.csv_data[j].tumor_laterality         = '';
                        $scope.csv_data[j].size_of_tumor            = '';
                        $scope.csv_data[j].clavien_minor_no         = '';
                        $scope.csv_data[j].clavien_major_no         = '';
                        $scope.csv_data[j].sbl                      = '';
                        $scope.csv_data[j].aegfr                    = '';
                        $scope.csv_data[j].addimission_hemoglobin   = '';
                        $scope.csv_data[j].degfr                    = '';
                        $scope.csv_data[j].discharge_hemoglobin     = '';
                        $scope.csv_data[j].question                 = data[i].questionDetails[k].name;
                        var ans_txt = '';
                        if((data[i].questionDetails[k].answer_type == 'rb') || (data[i].questionDetails[k].answer_type == 'cb') || (data[i].questionDetails[k].answer_type == 'dd')){
                            for(var l = 0; l < data[i].questionDetails[k].answer.length; l++){
                                if(ans_txt != ""){
                                    ans_txt = ans_txt + ', ' + data[i].questionDetails[k].answer[l].name;
                                } else {
                                    ans_txt = data[i].questionDetails[k].answer[l].name;
                                }
                                
                            }
                        } else{
                            ans_txt = data[i].questions[k].answer;
                        }
                        $scope.csv_data[j].ans                      = ans_txt;
                        j++;
                    }
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
            alert(pname+'-----'+questnnaire);
            console.log($scope.csv_data);
        }
    }

    if (flag == "report") {
        $scope.list();
    }
});