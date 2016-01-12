var path = require('path');

module.exports = {
    paths: {
        sources: {
            scripts: path.join(__dirname, '/Scripts/'),
            entryModule: 'boot.js',

            // additional resources
            babel_polyfill: path.join(__dirname, '../node_modules/babel-polyfill/'),
            angular2_polyfill: path.join(__dirname, '../node_modules/angular2/bundles/angular2-polyfills.js'),
            jquery: path.join(__dirname, '../node_modules/jquery/dist/jquery.js'),
            bootstrap_webpack: path.join(__dirname, '../node_modules/bootstrap-webpack/'),
            holderjs: path.join(__dirname, '../node_modules/holderjs/src/index.js')
        },

        // target folder
        target: path.join(__dirname, '/Scripts/build/'),
        targetFilename: 'app.bundle.js',

        // vendor node modules
        nodeModules: path.join(__dirname, '../node_modules')
    }
};