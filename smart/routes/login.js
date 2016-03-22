var express = require('express');
var router = express.Router();

var db = require("./database");


router.get('/', function(req, res, next) {
  var userid = req.session.user;
  if (userid != undefined) {
    res.redirect('/');
  }
  else {
    res.render('login');
  }
});


router.post('/', function(req, res, next) {
  var action = req.query["action"];
  if (action == "login") {
    console.log(req.body.user + ":" + req.body.passwd);
    db.checkuser(req.body.user, req.body.passwd,
    function(result){
      if(result){
        req.session.user = req.body.user;
        res.send("success");
      }else{
        res.send("nouser");
      }
    });
  }else if(action == "logout"){
    req.session.user = undefined;
    res.send("success");
  }
});

module.exports = router;
