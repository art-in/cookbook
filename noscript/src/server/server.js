const express = require('express');
const compression = require('compression');
const logger = require('morgan');
const bodyParser = require('body-parser');
const formDataParser = require('connect-busboy');

const api = require('./api');
const config = require('../../config.json');

const app = express();

app.use(compression());
app.use(bodyParser.json());
app.use(formDataParser({immediate: true}));
app.use(logger('dev'));

app.use(express.static('../client'));
// for references to node_modules folder
app.use(express.static('../../'));

app.use(api);

// global error handler
// eslint-disable-next-line no-unused-vars
app.use(function(err, req, res, next) {
  console.error(err);
  res.status(500).send();
});

const {host, port} = config.server;
app.listen(port, host, () => console.log(`Serving at ${host}:${port}`));
