var FitbitApiClient 	= require("fitbit-node")
, client 		= new FitbitApiClient("d8451f99be86006a8c7a95e0b1e7e31c", "a85f60f84784773996937d4909097fe9");

var requestTokenSecrets = {};

authorize = function(req, res, next){
    console.log(client);
    client.getRequestToken().then(function (results) {
	console.log(results);
	    var token = results[0],
	    secret = results[1];
	    requestTokenSecrets[token] = secret;
	    res.redirect("http://www.fitbit.com/oauth/authorize?oauth_token=" + token);
    }, function (error) {
	    console.log('error = ',error)
	    res.send(error);
    });
}


oauthCallback = function(req, res){
    var token = req.query.oauth_token,
	    secret = requestTokenSecrets[token],
	    verifier = req.query.oauth_verifier;
    client.getAccessToken(token, secret, verifier).then(function (results) {
	    var accessToken = results[0],
		    accessTokenSecret = results[1],
		    userId = results[2].encoded_user_id;
		//res.redirect("https://api.fitbit.com/1/user/"+userId+"/activities/heart/date/today/1d.json");
	    return client.get("/activities/heart/date/2016-02-01/1d/1sec.json", accessToken, accessTokenSecret).then(function (results) {
		    var response = results[0];
		    res.send(response);
	    });
		// working 'for daily activities data'.
	     /*return client.get("/activities/date/2016-01-31.json", accessToken, accessTokenSecret).then(function (results) {
		    var response = results[0];
		    res.send(response);
	    });*/
		// working 'for profile data'.
	    /* return client.get("/profile.json", accessToken, accessTokenSecret).then(function (results) {
		    var response = results[0];
		    res.send(response);
	    });*/
    }, function (error) {
	    res.send(error);
    });
}


module.exports = function(){
    this.authorize        = authorize;
    this.oauthCallback    = oauthCallback;
}