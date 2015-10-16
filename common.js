// Packages to include in Common files
var crypto = require('crypto');
//End of code to include packages in common files

// function and code to encrypt and decrypt text
var algorithm = 'aes-256-ctr', password = 'd6F3Efeq';
function Common(){}
Common.prototype.encrypt = function(text){
    var cipher = crypto.createCipher(algorithm,password)
    var crypted = cipher.update(text,'utf8','hex')
    crypted += cipher.final('hex');
    return crypted;
}
Common.prototype.decrypt = function(text){
    var decipher = crypto.createDecipher(algorithm,password)
    var dec = decipher.update(text,'hex','utf8')
    dec += decipher.final('utf8');
    return dec;  
}
// End of code to encrypt and decrypt function

module.exports = new Common();