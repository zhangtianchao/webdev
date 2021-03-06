
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:1863/smart');

var Schema = mongoose.Schema;
var userSchema = new Schema({
  name: String,
  passwd: String
});
var UserModel = mongoose.model('UserModel', userSchema);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

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
      console.log('add default user admin:111111');
    }
    else {
      console.log('%s:%s.', user.name, user.passwd);
    }
  });
  
  UserModel.findOne({
    name: 'tico'
  }, 'name passwd', function(err, user) {
    
    var tico = new UserModel({
      name: 'tico',
      passwd: '222222'
    });

    if (err) {
    }
    if (user == null) {
      // not found
      // create one
      tico.save();
      console.log('add default user tico:222222');
    }
    else {
      console.log('%s:%s.', user.name, user.passwd);
    }
  });

});

function checkUser(name, passwd, callback) {
  
  //var found = false;
  
  UserModel.findOne({
      name: name,
      passwd: passwd
    }, 'name passwd', function(err, user) {
      if (err) {
        //return false;
        callback(false);
      }
      if (user == null) {
        // not found
        //found = false;
        //return false;
        callback(false);
      }
      else {
        console.log('found %s:%s.', name, passwd);
        //found = true;
        //return true;
        callback(true);
      }
    });
}

module.exports = checkUser;
