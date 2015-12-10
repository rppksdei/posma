var nodemailer = require('nodemailer');
exports.send = function(user, subjectVal, view, from) {
	/* var path = require('path');
	var rootPath = path.resolve(sails.config.appPath); */
	var fs = require('fs');
	var mailBody = fs.readFileSync('./emailTemplates/'+view).toString();
	//mailBody = view;
	mailBody = mailBody.replace("{{username}}", user.username);
	mailBody = mailBody.replace("{{name}}", user.first_name);
	mailBody = mailBody.replace("{{password}}",user.pass);
	//mailBody = mailBody.replace("{path}",appUrl);
	//mailBody = mailBody.replace("{token}", user.id);
	//var smtpTransport = require('nodemailer-smtp-transport');
	var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'raman.sdei@gmail.com',
            pass: 'raman@2015'
        }
    });
	/* var transport = nodemailer.createTransport(smtpTransport({
			host: sails.config.appSMTP.host,
			port: sails.config.appSMTP.port,
			debug: sails.config.appSMTP.debug,
			auth: {
				user: sails.config.appSMTP.auth.user
				pass: sails.config.appSMTP.auth.pass
			}
		})
	);*/
	// create reusable transporter object using SM,TP transport 
    // NB! No need to recreate the transporter object. You can use 
    // the same transporter object for all e-mails 
    // setup e-mail data with unicode symbols 
    if(!from){
    	var from = 'Ramanpreet ✔ <raman411@gmail.com>';
    }

    var mailOptions = {
        from:  from,// sender address 
        to: user.email, // list of receivers 
        subject: subjectVal, // Subject line 
        //text: mailBody, // plaintext body 
        html: mailBody // html body 
    };
    // send mail with defined transport object 
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });
};


/*
sendEmail = function(req, res){
    // create reusable transporter object using SMTP transport 
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'raman.sdei@gmail.com',
            pass: 'raman@2015'
        }
    });
     
    // NB! No need to recreate the transporter object. You can use 
    // the same transporter object for all e-mails 
     
    // setup e-mail data with unicode symbols 
    var mailOptions = {
        from: 'Ramanpreet ✔ <raman411@gmail.com', // sender address 
        to: 'raman.sdei@gmail.com', // list of receivers 
        subject: 'Hello ✔', // Subject line 
        text: 'Hello world ✔', // plaintext body 
        html: '<b>Hello world ✔</b>' // html body 
    };
     
    // send mail with defined transport object 
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });
}*/
