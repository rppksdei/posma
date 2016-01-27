
/* function to send Notification to Android. */
sendToAndroid = function() {
	var gcm 	= require('android-gcm');
	//var serverKey	= "AIzaSyDYsAkLDonjshinmt0i3T6bs0tEQWjHE28"; // type : server {google API console}
	var serverKey	= "AIzaSyAR1S24YeY2l1YlgiPigaPcplRNzAmu_Ck"; // type : android {google API console}

	var senderId 	= "707879217713";
	
	// initialize new androidGcm object
	var gcmObject = new gcm.AndroidGcm(serverKey);
	// create new message
	var finalmessage = new gcm.Message({
	    //registration_ids: ['fFYYIGMEU64:APA91bEVAPaAbctRi3OO_kclxzYbCPUm0x6iR7K_QVmv_opfq9X8dkT6WGhOTKOSAM7ynu8aTlCyzHo6WD5OpjjsOtYUiVZEht-5I6YnGzY8eaPczeT8lSA_s6n59jyp-zjmuH5QMKnq'],
	    registration_ids: ['cqbushGFk28:APA91bFICdaJ2FIMt-4-EjQlg9z0xeIHfD2dWtPIUZ5C_NqVBY3SAKh9rnmw9NmhmjihjIeLBss6R6DtrfngyRgaLLHc7UYPrpEQDT-U67NThfImWYnqmI-xupwZlsY-iqJ_PO7OePEa'],
	    data: {
		key1: 'This is Key1'
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
