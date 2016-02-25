const token = "HelloTico";
const crypto = require('crypto');
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
});

var getClientAddress = function (req) {
        return (req.headers['x-forwarded-for'] || '').split(',')[0] 
        || req.connection.remoteAddress;
};

router.post('/', function(req, res, next) {
    var user_data = {
        ip: "",
    	timestamp: "",
    	digest: ""
    };
    console.log(req.ip);
    console.log(req.connection.remoteAddress);
    console.log(getClientAddress(req));
    user_data.ip = req.body.ip;
    user_data.timestamp = req.body.timestamp;
    user_data.digest = req.body.digest;
    console.log(user_data.ip);
    var hash = crypto.createHash('sha256');
    hash.update(token);
    hash.update(user_data.timestamp);
    if(hash.digest('hex') == user_data.digest){
        res.send("success");
    }else{
        res.send("fail");
    }
});

module.exports = router;
