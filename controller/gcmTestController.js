
/* function to send Notification to Android. */
sendToAndroid = function() {
	var gcm 	= require('android-gcm');
	//var serverKey	= "AIzaSyDYsAkLDonjshinmt0i3T6bs0tEQWjHE28"; // type : server {google API console}

	//var serverKey	= "AIzaSyAR1S24YeY2l1YlgiPigaPcplRNzAmu_Ck"; // type : android {google API console}
	var serverKey	= "AIzaSyBFtOhKI6zT_zG6rUcIS0wirmphj8vRmaU"; // type : server {new}


	var senderId 	= "707879217713";
	
	// initialize new androidGcm object
	var gcmObject = new gcm.AndroidGcm(serverKey);
	// create new message
	var finalmessage = new gcm.Message({
	    //registration_ids: ['fFYYIGMEU64:APA91bEVAPaAbctRi3OO_kclxzYbCPUm0x6iR7K_QVmv_opfq9X8dkT6WGhOTKOSAM7ynu8aTlCyzHo6WD5OpjjsOtYUiVZEht-5I6YnGzY8eaPczeT8lSA_s6n59jyp-zjmuH5QMKnq'],

	    registration_ids: ['fohk9--R59g:APA91bEa6XMTJpNEimvxfbKS0estGAFNMkA9ZFd7OZdBYZQ6rIvVass2jGBm61bfP_MswpVgWOVfe2gcxuRq7XkLt5bBTNNX_zYh28fZxWMkoCs29NrkMmi_jqTKJlPUszdlO8OAiORr'],
	    data: {
		key1: 'This is Key1',
		title: 'This is test notification.',
		message: 'Pompy here. Pompy here. Pompy here. Pompy here. Pompy here. Pompy here. Pompy here. '
		// key2: 'key 2'
	    }
	});
	// send the message
	gcmObject.send(finalmessage, function(err, response) {
	    console.log("\nGCM Response ---------------------------------------------------\nError---\n", err,'\nResponse===\n', response);
	});
}


module.exports = function(){
    this.sendToAndroid	= sendToAndroid;
}
