import koa from 'koa';
import logger from 'koa-logger';
import compress from 'koa-compress';
import statics from 'koa-static';
import favicon from 'koa-favicon';
import path from 'path';
import bodyParser from 'koa-body';
import apiRouter from '../app.routers/api';
import config from './config';
import conditional from 'koa-conditional-get';

const app = koa();

app.config = config;

app.use(function* (next) {
    try {
        yield next;
    } catch (err) {
        this.status = 500;
        this.body = err.message;
        this.app.emit('error', err, this);
    }
});

app.use(logger());
app.use(compress());

app.use(bodyParser());

app.use(apiRouter.routes());

app.use(conditional());

app.use(favicon(path.join(__dirname, '../../../client/images/favicon.ico')));
app.use(statics(path.join(__dirname, '../../client')));

const server = app.listen(config.get('server:port'));

server.on('listening', function() {
    console.log(`Listening on ${server.address().port}`);
});

process.on('unhandledRejection', function(reason) {
    console.log('[Unhandled Rejection]:', reason.stack);
});
