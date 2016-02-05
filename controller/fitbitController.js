//var questionModel       = require("./../model/questionModel");
var Fitbit              = require('fitbit')
, config 		= require('./config/constants');

var FitbitApiClient 	= require("fitbit-node")
, client 		= new FitbitApiClient("d8451f99be86006a8c7a95e0b1e7e31c", "a85f60f84784773996937d4909097fe9");
var requestTokenSecrets = {};

createAPI = function(req, res, next){
    // Create an API client and start authentication via OAuth
    var client = new Fitbit(config.CONSUMER_KEY, config.CONSUMER_SECRET);
    console.log('\n CONSUMER_KEY = ',config.CONSUMER_KEY,'\n CONSUMER_SECRET = ', config.CONSUMER_SECRET)
    client.getRequestToken(function (err, token, tokenSecret) {
	if (err) {
	  // Take action
	  return;
	}
	
	req.session.oauth = {
	    requestToken: token
	  , requestTokenSecret: tokenSecret
	};
	res.redirect(client.authorizeUrl(token));
    });
}


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


getStats = function(req, res){
    client = new Fitbit(
      config.CONSUMER_KEY
    , config.CONSUMER_SECRET
    , { // Now set with access tokens
	  accessToken: req.session.oauth.accessToken
	, accessTokenSecret: req.session.oauth.accessTokenSecret
	, unitMeasure: 'en_GB'
      }
    );
    
    // Fetch todays activities
    client.getActivities(function (err, activities) {
	if (err) {
	  // Take action
	  return;
	}
	
	// `activities` is a Resource model
	res.send('Total steps today: ' + activities.steps());
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
	    return client.get("/activities/heart/date/2016-02-01/1d/1sec.json", accessToken, accessTokenSecret).then(		 function (results) {
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
    this.createAPI        = createAPI;
    this.getStats	  = getStats;
    this.authorize        = authorize;
    this.oauthCallback    = oauthCallback;
}