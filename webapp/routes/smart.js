var express = require('express');
var router = express.Router();

//var cookieParser = require('cookie-parser');


var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/smart');

var Schema = mongoose.Schema;
var userSchema = new Schema({
  name: String,
  passwd: String
});
var UserModel = mongoose.model('UserModel', userSchema);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
//   // we're connected!
//   console.log('mongodb connect ok');

//   var admin = new UserModel({
//     name: 'admin',
//     passwd: '111111'
//   });
//   admin.save();

//   UserModel.findOne({
//     name: 'admin'
//   }, 'name passwd', function(err, user) {
//     if (err) return;
//     console.log('%s:%s.', user.name, user.passwd);
//   });

//   UserModel.find(function(err, user) {
//     if (err) return;
//     console.log(user);
//     for (var i = 0; i < user.length; i++) {
//       user[i].remove();
//     }
//   });

// });
db.once('open', function() {
  // we're connected!
  console.log('mongodb connect ok');

  UserModel.findOne({
    name: 'admin'
  }, 'name passwd', function(err, user) {
    var admin = new UserModel({
      name: 'admin',
      passwd: '111111'
    });

    if (err) {
      //admin.save();
    }
    if (user == null) {
      // not found
      // create one
      admin.save();
    }
    else {
      console.log('%s:%s.', user.name, user.passwd);
    }
  });

});





// var query = admin.find({ name: 'admin' });
// query.select('name passwd');
// query.exec(function (err, user) {
//   if (err) return ;
//   console.log(user);
// });
// admin.findOne({ name: 'admin' }, 'name passwd', function (err, user) {
//   if (err) return ;
//   console.log('%s:%s.', user.name, user.passwd);
// });

// var query = admin.where({name:'admin'});
// query.findOne(function (err, user) {
//   if (err) return ;
//   console.log('%s:%s.', user.name, user.passwd);
// });

router.get('/', function(req, res, next) {
  // check session
  try{
  var userid = req.session.user;
  if(userid!=undefined){
    res.render('smart', {user:userid});
  }else{
    //req.session.user = "";
    //res.redirect('/smart/login');
    res.render('smart-login');
  }
  }catch(e){
    //req.session.user = "";
    //res.redirect('/smart/login');
    res.render('smart-login');
  }
});

router.get('/login', function(req, res, next) {
  res.render('smart-login');
});

router.post('/', function(req, res, next) {
  var action = req.query["action"];
  if (action == "login") {
    UserModel.findOne({
      name: req.body.user,
      passwd: req.body.passwd
    }, 'name passwd', function(err, user) {
      if (err) {
        //admin.save();
        res.send("nouser");
      }
      if (user == null) {
        // not found
        // create one
        res.send("nouser");
      }
      else {
        console.log('%s:%s.', user.name, user.passwd);
        req.session.user = req.body.user;
        //res.redirect('/smart');
        res.send("success");
      }
    });
  }
});

module.exports = router;
