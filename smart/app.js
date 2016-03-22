var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
//var RedisStore = require('connect-redis')(session);
var database = require("./routes/database");

var routes = require('./routes/index');
var users = require('./routes/users');
var login = require('./routes/login');
var device = require('./routes/device');
var wechatsrv = require('./routes/wechatsrv').router;
var mobile = require('./routes/mobile');

database.init(function(err, db){
  if(err == null){
    console.log("database init ok");
  }
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

if (process.env.session == "connect-redis") {
  console.log("connect-redis");
  var RedisStore = require('connect-redis')(session);
  var options = {
    "host": "localhost",
    "port": "6379",
    "ttl": 60 * 60, //Session的有效期为60*60s
  };

  app.use(session({
    store: new RedisStore(options),
    secret: 'smart session',
    resave: false,
    saveUninitialized: true,
  }));
}
else if (process.env.session == "connect-mongo") {
  console.log("connect-mongo");
  const MongoStore = require('connect-mongo')(session);
  app.use(session({
    store: new MongoStore({
      url: 'mongodb://localhost:1863/smart',
      ttl: 60 * 60
    }),
    secret: 'smart session',
    resave: false,
    saveUninitialized: true,
  }));
}
else {
  console.log("raw session");
  app.use(session({
    secret: 'smart session',
    resave: false,
    saveUninitialized: true,
  }));
}

// var options = {
//     "host": "localhost",
//     "port": "6379",
//     "ttl": 60*60,   //Session的有效期为60*60s
// };

// app.use(session({
//     //store: new RedisStore(options),
//     secret: 'smart session',
//     resave: false,
//     saveUninitialized: true,
// }));

app.use(function(req, res, next) {
  if (req.url.startsWith("/mobile")) {
    return next();
  }
    
  if (!req.session) {
    return next(new Error('oh no'));
  }
  var userid = req.session.user;
  if (userid != undefined) {
    next();
  }
  else {
    if (req.url.startsWith("/login")) {
      next();
    }
    else if (req.url.startsWith("/device")) {
      next();
    }
    else if (req.url.startsWith("/wechat")) {
      next();
    }
    else {
      res.redirect('/login');
    }
  }
});

app.use('/', routes);
app.use('/users', users);
app.use('/login', login);
app.use('/device', device);
app.use('/wechat', wechatsrv);
app.use('/mobile', mobile);
app.use('/mobile_overview', mobile);
app.use('/mobile_station', mobile);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  console.log("404 Error");
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
