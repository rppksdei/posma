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
    router.post('/cookieLogin',  function(req, res, next) {
        loginController.userCookieLogin(req, res, next);
    });
    router.get('/csv',function(req,res,next){
        var fields = ["name",'car', 'price', 'color'];
        var myCars = [
            {
                "car": "Audi",
                "price": 40000,
                "color": "blue"
            }, {
                "car": "BMW",
                "price": 35000,
                "color": "black"
            }, {
                "car": "Porsche",
                "price": 60000,
                "color": "green"
            }
        ];
        /*json2csv({ data: myCars, fields: fields }, function(err, csv) {
            if (err) console.log(err);
                fs.writeFile('file.csv', csv, function(err) {
            if (err) throw err;
                console.log('file saved');
            });
        });*/
        /*json2csv({ data: myCars, fields: fields }, function(err, csv) {
            if (err) console.log(err);
                console.log(csv);
        });*/
        /*json2csv({ data: myCars, fields: fields, del: '\t' }, function(err, tsv) {
            if (err) console.log(err);
                console.log(tsv);
        });*/
        var fieldNames = ['Car Name', 'Price USD', 'COLOR'];
        /*json2csv({ data: myCars, fields: fields, fieldNames: fieldNames }, function(err, csv) {
          if (err) console.log(err);
          console.log(csv);
        });*/
        /*var opts = {
          data: myCars,
          fields: fields,
          fieldNames: fieldNames,
          quotes: ''
        };
        json2csv(opts, function(err, csv) {
          if (err) console.log(err);
          console.log(csv);
        });
        */
        var fields = ["name",'questionnaire', 'question', 'answer'];
        var myCars = [
            {
                "name": "test",
                "questionnaire": "Questionnaire1",
                "question": "",
                "answer": "",
            }, {
                "name": "",
                "questionnaire": "",
                "question": "Q1",
                "answer": "A1",
            }, {
                "name": "",
                "questionnaire": "",
                "question": "Q2",
                "answer": "A2",
            }, {
                "name": "",
                "questionnaire": "",
                "question": "Q3",
                "answer": "A3",
            }, {
                "name": "test2",
                "questionnaire": "Questionnaire2",
                "question": "",
                "answer": "",
            }, {
                "name": "",
                "questionnaire": "",
                "question": "Q1",
                "answer": "A1",
            }, {
                "name": "",
                "questionnaire": "",
                "question": "Q2",
                "answer": "A2",
            }, {
                "name": "",
                "questionnaire": "",
                "question": "Q3",
                "answer": "A3",
            }
        ];
        json2csv({ data: myCars, fields: fields }, function(err, csv) {
            if (err) console.log(err);
                fs.writeFile('file.csv', csv, function(err) {
                if (err) throw err;
                    console.log('file saved');
            });
        });
    })

    router.get('/test',  function(req, res, next) {
        var d = new Date();
        var tz = d.getTimezoneOffset();
        var dy = d.getFullYear();
        var dm = d.getMonth()+1;
        var dd = d.getDate();
        var dh = d.getHours();
        var dmi = d.getMinutes();
        var ds = d.getMinutes();
        var clienttimezone = -330;
        //cron should be executed at 29 Friday at 13:00
        var myDate="29-01-2016";
        myDate=myDate.split("-");
        var newDate=dd+"/"+dm+"/"+dy+' '+dh+':'+dmi+':'+ds;
        var timestamp = new Date().getTime();
        var client_date = timestamp - (tz*1000) + (clienttimezone*1000);
        date = new Date(client_date);
        datevalues = [
           date.getFullYear(),
           date.getMonth()+1,
           date.getDate(),
           date.getHours(),
           date.getMinutes(),
        ];
        res.sendStatus(d+'----'+'----'+date+'\n-----'+tz+'---'+newDate+'-------------'+datevalues);
    });
    app.use('/login',router);
}