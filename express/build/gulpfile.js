var gulp = require('gulp'),
    path = require('path'),
    fs = require('fs'),
    packageJson = require('../package.json'),
    util = require('gulp-util'),
    concat = require('gulp-concat'),
    insert = require('gulp-insert'),
    uglify = require('gulp-uglify'),
    del = require('del'),
    minifyCSS = require('gulp-minify-css'),
    sprite = require('gulp-sprite-generator'),
    replace = require('gulp-replace'),
    requirejs = require('gulp-requirejs'),
    ncp = require('ncp');

//region Paths

var modulesFolder = 'node_modules/';

var paths = {
    src: '../src/',
    target: './out/',
    modules: '../' + modulesFolder
};

paths.config = {
    main: paths.src + 'config.json',
    overrides: './config.overrides.json'
};

paths.client = {
    src: paths.src + 'client/',
    target: paths.target + 'client/'
};

paths.client.scripts = {
    src: paths.client.src + 'scripts/',
    srcMask: paths.client.src + 'scripts/*.js',
    target: paths.client.target + 'scripts/',
    targetMask: paths.client.target + '*.js',
    bundle: 'app.js'
};

paths.client.styles = {
    src: paths.client.src + 'styles/',
    srcMask: paths.client.src + 'styles/*.css',
    target: paths.client.target + 'styles/',
    targetMask: paths.client.target + 'styles/*.css',
    bundle: 'styles.css'
};

paths.client.images = {
    src: paths.client.src + 'images/',
    srcMask: paths.client.src + 'images/*',
    target: paths.client.target + 'images/',
    targetMask: paths.client.target + 'images/*.png',
    sprite: 'sprite.png'
};

paths.client.views = {
    src: paths.client.src + 'views/',
    srcMask: paths.client.src + 'views/*.jade',
    target: paths.client.target + 'views/'
};

//endregion

//region Presentation

gulp.task('clean', function(cb) {
    del([paths.target], {force: true},  cb);
});

gulp.task('scripts', ['clean'], function() {
    return requirejs({
        name: 'client',
        baseUrl: paths.client.scripts.src,
        mainConfigFile: paths.client.scripts.src + 'lib/require.config.js',
        paths: {
            requireLib: 'lib/vendor/require'
        },
        include: ['requireLib'],
        out: paths.client.scripts.bundle
    })
    .pipe(insert.append('require(["client"]);'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.client.scripts.target));
});

gulp.task('styles', ['clean'], function() {
    return gulp.src(paths.client.styles.srcMask)
    
        // Replace all 'url(/images/image.png)' with 'url(../images/image.png)',
        // so sprite generator can find target images
        .pipe(replace(/\/images\//g, '../images/'))
        .pipe(concat(paths.client.styles.bundle))
        .pipe(gulp.dest(paths.client.styles.target));
});

gulp.task('images', ['clean'], function() {
    return gulp.src(paths.client.images.srcMask)
               .pipe(gulp.dest(paths.client.images.target));
});

gulp.task('sprites', ['clean', 'styles', 'images'], function() {
    var spriteName = paths.client.images.sprite;
    
    // Sprite technique does not work well with repeating backgrounds,
    // so let those images be loaded separatly
    var ignoreImages = ['back.png', 'back-filler.png'];
    
    var spriteOutput = gulp.src(paths.client.styles.targetMask)
        .pipe(sprite({
            baseUrl: paths.client.styles.target,
            spriteSheetName: spriteName,
            accumulate: true,
            padding: 2, // prevent overlapping when zooming (Chrome)
            filter: function(imageDesc) {
                var imageName = path.parse(imageDesc.path).base;
                return ignoreImages.indexOf(imageName) === -1;
            } 
        }));

    var spriteStream = spriteOutput.css
        .pipe(replace(spriteName, '/images/' + spriteName))
        .pipe(minifyCSS({keepBreaks:true}))
        .pipe(gulp.dest(paths.client.styles.target));

    spriteOutput.img.pipe(gulp.dest(paths.client.images.target));

    // Delete all images except sprite
    spriteStream.on('end', function() {
        var ignorePaths = ignoreImages.concat([spriteName]).map(function(imageName) {
            return '!'+ paths.client.images.target + imageName;
        });
        del([paths.client.images.targetMask].concat(ignorePaths), {force: true});
    });
    
    return spriteStream;
});

gulp.task('views', ['clean'], function() {
    return gulp.src(paths.client.views.srcMask)
        
        // Replace all style links with single reference to combined css
        .pipe(replace(/link.*rel='stylesheet'.*\)/, '#FIRSTSTYLETAG#'))
        .pipe(replace(/link.*rel='stylesheet'.*\)/g, ''))
        .pipe(replace(/#FIRSTSTYLETAG#/,
            "link(rel='stylesheet', href='/styles/" + paths.client.styles.bundle + "')"))
        
        // Replace all script tags with single reference to combined js
        .pipe(replace(/script.*\)/, '#FIRSTSCRIPTTAG#'))
        .pipe(replace(/script.*\)/g, ''))
        .pipe(replace(/#FIRSTSCRIPTTAG#/,
            "script(src='/scripts/" + paths.client.scripts.bundle + "')"))
        
        .pipe(gulp.dest(paths.client.views.target));
});

gulp.task('client', ['scripts', 'styles', 'images', 'sprites', 'views']);

//endregion

//region Backend

gulp.task('backend', ['clean'], function() {

    // Copy node modules
    // Ignore environment specific modules (os type, bitness, etc),
    // they should be explicitly installed in target environment
    var ignoreModules = ['lwip', 'mongodb'];
    
    fs.mkdirSync(paths.target);
    fs.mkdirSync(paths.target + modulesFolder);
    
    Object.keys(packageJson.dependencies).forEach(function(dependency) {
        if (ignoreModules.indexOf(dependency) !== -1) return;
        
        ncp(paths.modules + dependency, 
            paths.target + modulesFolder + dependency, 
            function (err) {
                if (err) throw err;
            });
    });
    
    // Copy everything except client src
    return gulp.src([paths.src + '**/*', '!' + paths.client.src + '**/*'])
               .pipe(gulp.dest(paths.target));
});

//endregion

//region Config

gulp.task('config', ['clean', 'backend'], function() {
    return gulp.src([paths.config.main, paths.config.overrides])
               .pipe(gulp.dest(paths.target));
});

//endregion

gulp.task('build', ['backend', 'client', 'config']);

gulp.task('default', ['build']);
