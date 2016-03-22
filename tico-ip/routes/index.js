var express = require('express');
var router = express.Router();

const token = "HelloTico";
const crypto = require('crypto');

var rpi2_ip = "???";

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: rpi2_ip });
});

router.post('/', function(req, res, next) {
    var user_data = {
        ip: "",
    	timestamp: "",
    	digest: ""
    };
    try{
    user_data.ip = req.body.ip;
    user_data.timestamp = req.body.timestamp;
    user_data.digest = req.body.digest;
    console.log(user_data.ip);
    var hash = crypto.createHash('sha256');
    hash.update(token);
    hash.update(user_data.timestamp);
    if(hash.digest('hex') == user_data.digest){
        res.send("success");
        rpi2_ip = user_data.ip;
    }else{
        res.send("fail");
    }
    }catch(e){
        console.log(e);
    }
});

module.exports = router;
