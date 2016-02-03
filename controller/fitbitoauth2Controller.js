var Fitbit 	= require("fitbit-oauth2")
, config        = require('./../config/oauth-creds.json' )
/*, client 	= new FitbitApiClient("d8451f99be86006a8c7a95e0b1e7e31c", "a85f60f84784773996937d4909097fe9")*/;


// Instanciate the client
var fitbit = new Fitbit( config.fitbit );
//console.log(config);

// In a browser, http://localhost:8987/fitbit to authorize a user for the first time.
authorize = function(req, res){
    console.log(fitbit.authorizeURL());
    res.redirect( fitbit.authorizeURL() );
}


oauthCallback = function(req, res, next){
    var code = req.query.code;
    fitbit.fetchToken( code, function( err, token ) {
        if ( err ) return next( err );

        // persist the token
        //persist.write( tfile, token, function( err ) {
            //if ( err ) return next( err );
            res.redirect( '/fit/fb-profile' );
        //});
    });
}

getdata = function(req, res, next){
    fitbit.request({
        //uri: "https://api.fitbit.com/1/user/-/profile.json",
        uri: "https://api.fitbit.com/1/user/-/activities/heart/date/today/1d.json",
        
        method: 'GET',
    }, function( err, body, token ) {
        if ( err ) return next( err );
        var profile = JSON.parse( body );
        // if token is not null, a refesh has happened and we need to persist the new token
        /*
        if ( token )
            persist.write( tfile, token, function( err ) {
                if ( err ) return next( err );
                    res.send( '<pre>' + JSON.stringify( profile, null, 2 ) + '</pre>' );
            });
        else
        */
            res.send( '<pre>' + JSON.stringify( profile, null, 2 ) + '</pre>' );
    });
}

module.exports = function(){
    this.authorize        = authorize;
    this.oauthCallback    = oauthCallback;
    this.getdata          = getdata;
}