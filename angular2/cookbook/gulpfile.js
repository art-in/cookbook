/// <binding ProjectOpened='default' />
var gulp = require('gulp');
var webpack = require('webpack');
var run = require('run-sequence');
var gutil = require('gulp-util');
var path = require('path');
var del = require('del');

var config = require('./config');

var isDev = false;

gulp.task('clean', function() {
    return del(config.paths.target + '**/*');
});

gulp.task('build', ['clean'], function () {

    var devtool;
    var plugins = [];

    if (isDev) {
        // fast on incremental builds
        devtool = 'eval-source-map';
    } else {
        devtool = 'source-map';
        plugins.push(new webpack.optimize.UglifyJsPlugin({ compress: false }));
    }

    webpack({
        context: config.paths.sources.scripts,
        entry: [
            config.paths.sources.babel_polyfill,
            config.paths.sources.angular2_polyfill,
            config.paths.sources.scripts + config.paths.sources.entryModule
        ],
        plugins: plugins.concat([]),
        module: {
            preLoaders: [
                {
                    test: /\.js$/,
                    loaders: ['eslint'],
                    include: [config.paths.sources.scripts],
                    exclude: [/vendor/]
                }
            ],
            loaders: [
                {
                    test: /\.js$/,
                    loader: 'babel-loader',
                    exclude: [
                        /node_modules/
                    ],
                    query: {
                        plugins: [
                            // for dependency injection by property type
                            // "constructor(router: Router)"
                            'angular2-annotations',
                            // 'legacy' because standard for decorators
                            // is still being changed, and this is only
                            // available working solution for now
                            'transform-decorators-legacy',
                            'transform-class-properties',
                            // for "constructor(router: Router)"
                            //  -> "constructor(router)"
                            'transform-flow-strip-types'],
                        presets: ['es2015', 'stage-0']
                    }
                }
            ],
            noParse: [
                config.paths.sources.angular2_polyfill
            ]
        },
        eslint: {
            emitWarning: true
        },
        resolveLoader: {
            root: config.paths.nodeModules
        },
        resolve: {
            alias: {
            }
        },
        devtool: devtool,
        watch: isDev,
        output: {
            path: config.paths.target,
            filename: config.paths.targetFilename
        }
    }, function(err, stats) {
        if (err) {
            console.log(err);
            return;
        }

        gutil.log("[webpack]", stats.toString({ colors: true, chunks: false }));
        gutil.log("Output: " + gutil.colors.magenta(config.paths.target));
    });
});

gulp.task('watch', function() {
    isDev = true;

    run(['build']);
});

gulp.task('default', ['watch']);