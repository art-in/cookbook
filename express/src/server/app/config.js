var path  = require('path'),
    nconf = require('nconf'),
    debug = require('debug')('cookbook:config');

var DEFAULT_CONFIG_PATH = path.join(__dirname, '../../' + 'config.json');
var OVERRIDES_CONFIG_PATH = path.join(__dirname, '../../' + 'config.overrides.json');

// 1. Overrides config
nconf.file(OVERRIDES_CONFIG_PATH);

// 2. Default config
nconf.add('', {type: 'file', file:DEFAULT_CONFIG_PATH});

// 3. Map environment variables (top priority)
process.env.IP && nconf.set('server:ip', process.env.IP);
process.env.PORT && nconf.set('server:port', process.env.PORT);

debug('Server address: ' + nconf.get('server:ip') + ':' + nconf.get('server:port'));
debug('Database connection string: ' + nconf.get('server:database:connectionString'));

module.exports = nconf;