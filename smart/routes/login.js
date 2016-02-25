var express = require('express');
var router = express.Router();

var checkUser = require("./checkuser.js");


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
    // if (checkUser(req.body.user, req.body.passwd)) {
    //   req.session.user = req.body.user;
    //   res.send("success");
    //   //res.redirect('/');
    // }
    // else {
    //   res.send("nouser");
    // }
    checkUser(req.body.user, req.body.passwd,
    function(result){
      if(result){
        req.session.user = req.body.user;
        res.send("success");
      }else{
        res.send("nouser");
      }
    });
  }
});

module.exports = router;
