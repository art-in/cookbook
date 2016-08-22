import path from 'path';
import nconf from 'nconf';
import debugModule from 'debug';

const debug = debugModule('cookbook:config');

const DEFAULT_CONFIG_PATH =
    path.join(__dirname, '../../config.json');
const OVERRIDES_CONFIG_PATH = 
    path.join(__dirname, '../../config.overrides.json');

// 1. Map environment variables (top priority)
const env = function() {
    process.env.IP && nconf.set('server:ip', process.env.IP);
    process.env.PORT && nconf.set('server:port', process.env.PORT);
};

// 2. Overrides config
nconf.file(OVERRIDES_CONFIG_PATH);

// 3. Default config
nconf.add('', {type: 'file', file: DEFAULT_CONFIG_PATH});

env();

debug(
    'Server address: ' +
    nconf.get('server:ip') + ':' + 
    nconf.get('server:port'));

debug(
    'Database connection string: ' + 
    nconf.get('server:database:connectionString'));

module.exports = nconf;