var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    var userid = req.session.user;
    res.render('index', {user:userid});
  //res.render('index');
});

module.exports = router;
