var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('express-flash');
var session = require('express-session');
var mongoose = require('mongoose');

// Read the mLab connection URL
var config = require('./config/db_config');
var db_url = config.db_url;

// and connect to the db. Print success or error message
mongoose.connect(db_url)
    .then( () => { console.log('Connected to mLab'); })
    .catch( (err) => { console.log('Error connecting to mLab', err); });

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({secret: 'top secret', resave: false, saveUninitialized: false}));
app.use(flash());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  // If you can't find the ObjectId
  if (err.kind === 'ObjectId' && err.name == 'CastError') {
    err.status = 404;
    err.message = 'ObjectId Not Found';
    res.render('custom_404')
  }

  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
