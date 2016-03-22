var express = require('express');
var router = express.Router();

var WechatOauth = require("wechat-oauth");

const wechat_token = 'HelloTico';
const wechat_appid = 'wx2fd5141e2a8ebcaa';
const wechat_secret = 'fff1220ced0530ff1d464a5f495fdbfe';

var wechatoa = new WechatOauth(wechat_appid, wechat_secret);

/* GET home page. */
router.get('/', function(req, res, next) {
    
    var code = req.query["code"];
    var state = req.query['state'];
    
    if(code == undefined){
        console.log("no code return");
        res.redirect('/login');
        return;
    }
    
    wechatoa.getAccessToken(code, function(err, result){
        
        console.log(result);
        
        if(err != null){
            return;
        }
        
        req.session.user = result.data.openid;
        var openid = result.data.openid;
        
        if(state == "station"){
            res.render('mobile_station', {user:openid});
        }else{
            res.render('mobile_overview', {user:openid});
        }
    });
});

// router.get('/', function(req, res, next) {
    
//     res.render('mobile_station', {user:"111111"});
// });

module.exports = router;
