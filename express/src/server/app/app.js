var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compression = require('compression');
var config = require('./config');
var queryJson = require('./middlewares/query-json');
var bodyJson = require('./middlewares/body-json');
var debug = require('debug')('cookbook:app');

var index = require('../app.routes/index');
var api = require('../app.routes/api');

var app = express();

// set config ref
app.config = config;

app.use(compression());

// view engine setup
app.set('views', path.join(__dirname, '../../client/views'));
app.set('view engine', 'jade');
app.set('view options', { pretty: true });
app.set('query parser', 'simple');

app.use(favicon(path.join(__dirname, '../../client/images/favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../../client')));

app.use(bodyJson());
app.use(queryJson());

// routes
app.use('/', index);
app.use('/api', api);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.end(err.toString());
    
    if (err.status !== 404) {
      console.log(err.stack ? err.stack : err.toString());
    }
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.end();
  
  if (err.status !== 404) {
      console.log(err.stack ? err.stack : err.toString());
    }
});

module.exports = app;
