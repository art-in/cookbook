var app = require('koa')();
var logger = require('koa-logger');
var compress = require('koa-compress');
var statics = require('koa-static');
var favicon = require('koa-favicon');
var path = require('path');
var bodyParser = require('koa-body');
var bodyParserJson = require('./middlewares/body-json');
var indexRouter = require('../app.routers/index');
var apiRouter = require('../app.routers/api');
var config = require('./config');
var views = require('koa-views');
var conditional = require('koa-conditional-get');

app.config = config;

app.use(logger());
app.use(compress());

app.use(bodyParser());
app.use(bodyParserJson());

app.use(views(path.join(__dirname, '../../client/views'), 
              { map: { html: 'jade' }, 'default': 'jade' }));

app.use(indexRouter.routes());
app.use(apiRouter.routes());

app.use(conditional());

app.use(favicon(__dirname + '../../../client/images/favicon.ico'));
app.use(statics(path.join(__dirname, '../../client')));

module.exports = app;
