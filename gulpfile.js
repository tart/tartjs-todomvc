var gulp = require('gulp'),
    minifyCss = require('gulp-minify-css'),
    concatCss = require('gulp-concat-css'),
    rev = require('gulp-rev'),
    htmlReplace = require('gulp-html-replace'),
    revReplace = require('gulp-rev-replace'),
    htmlMin = require('gulp-htmlmin'),
    path = require('path'),
    revNapkin = require('gulp-rev-napkin'),
    del = require('del'),
    server = require('gulp-server-livereload'),
    filenames = require('gulp-filenames'),
    shell = require('gulp-shell'),
    symlink = require('gulp-symlink'),
    runSequence = require('run-sequence');


gulp.task('default', function(callback) {
    runSequence('clean:before',
        ['deps', 'dev-process-html'],
        'dev-symlink',
        'watch',
        'serve',
        callback);
});


gulp.task('bundle', function(callback) {
    runSequence('clean:before',
        ['compile', 'minify-css'],
        ['revision', 'static'],
        'bundle-process-html',
        'clean:after', callback);
});


gulp.task('clean:before', function(callback) {
    del('dist/*', callback);
});


gulp.task('clean:after', function(callback) {
    del('rev-manifest.json', callback);
});


gulp.task('minify-css', function() {
    return gulp.src(['src/css/reset.css', 'src/css/base.css', 'src/**/*.css']).
        pipe(concatCss('style.css', {
            rebaseUrls: false
        })).
        pipe(minifyCss()).
        pipe(gulp.dest('dist'));
});


gulp.task('revision', function() {
    return gulp.src(['dist/script.js', 'dist/style.css']).
        pipe(rev()).
        pipe(gulp.dest('dist')).
        pipe(revNapkin()).
        pipe(rev.manifest()).
        pipe(gulp.dest(''));
});


gulp.task('static', function() {
    return gulp.src('static/**/*').
        pipe(gulp.dest('dist/static'));
});


gulp.task('get-css', function() {
    return gulp.src(['src/css/reset.css', 'src/css/base.css', 'src/**/*.css']).
        pipe(filenames('css'));
});


gulp.task('bundle-process-html', function() {
    var manifest = gulp.src('./rev-manifest.json');

    return gulp.src('src/index.html').
        pipe(htmlReplace({
            'tartjs': ['style.css', 'script.js']
        })).
        pipe(gulp.dest('dist')).
        pipe(revReplace({manifest: manifest})).
        pipe(htmlMin({collapseWhitespace: true})).
        pipe(gulp.dest('dist'));
});


gulp.task('dev-process-html', ['get-css'], function() {
    var css = filenames.get('css');
    var js = ['lib/tartJS/third_party/goog/closure/goog/base.js', 'deps.js', 'app.js'];

    return gulp.src('src/index.html').
        pipe(htmlReplace({
            'tartjs': css.concat(js)
        })).
        pipe(gulp.dest('dist'));
});


gulp.task('dev-symlink', function() {
    return gulp.src(['lib/', 'src/*', '!src/index.html'], {read: false}).
        pipe(symlink(function(file) {
            return path.join('dist', file.relative);
        }, {force: true}));
});


gulp.task('watch', function() {
    function changeLogger(event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    }

    gulp.watch('src/**/*.js', ['deps']).on('change', changeLogger);
    gulp.watch('src/index.html', ['dev-process-html']).on('change', changeLogger);
});


gulp.task('serve', function() {
    return gulp.src('dist').pipe(server({
        watchPath: 'src',
        livereload: {
            enable: true,
            path: 'src'
        },
        open: true
    }));
});


gulp.task('deps', shell.task(
    'lib/tartJS/third_party/goog/closure/bin/build/depswriter.py \
        --root_with_prefix="lib/tartJS/tart ../../../../tart" \
        --root_with_prefix="lib/tartJS/third_party/goog/closure/goog ./" \
        --root_with_prefix="lib/tartJS/third_party/goog/third_party/closure/goog ../../third_party/closure/goog" \
        --root_with_prefix="src/ ../../../../../../../" \
        --output_file="dist/deps.js"'
));


gulp.task('compile', shell.task(
    'lib/tartJS/third_party/goog/closure/bin/build/closurebuilder.py \
        --root=src/ \
        --root=lib/tartJS/tart/ \
        --root=lib/tartJS/third_party/goog/closure/goog/ \
        --root=lib/tartJS/third_party/goog/third_party/closure/goog/ \
        --namespace="todomvc.app" \
        --output_mode=compiled \
        --output_file=dist/script.js \
        --compiler_jar=lib/tartJS/tools/compiler/compiler.jar \
        --compiler_flags="--compilation_level=ADVANCED_OPTIMIZATIONS" \
        --compiler_flags="--output_wrapper=\'(function(){%output%})()\'" \
        --compiler_flags="--create_source_map=\'dist/source_map.js\'" \
        --compiler_flags="--formatting=PRETTY_PRINT" \
        --compiler_flags="--warning_level=VERBOSE" \
        --compiler_flags="--externs=lib/tartJS/tart/externs/jquery-1.4.4.externs.js" \
        --compiler_flags="--externs=lib/tartJS/tart/externs/tart.externs.js" \
        --compiler_flags="--externs=lib/tartJS/tart/externs/jasmine.externs.js" \
        --compiler_flags="--externs=src/todomvc.externs.js" \
        --compiler_flags="--jscomp_error=accessControls" \
        --compiler_flags="--jscomp_error=checkRegExp" \
        --compiler_flags="--jscomp_error=checkTypes" \
        --compiler_flags="--jscomp_error=checkVars" \
        --compiler_flags="--jscomp_error=invalidCasts" \
        --compiler_flags="--jscomp_error=missingProperties" \
        --compiler_flags="--jscomp_error=nonStandardJsDocs" \
        --compiler_flags="--jscomp_error=strictModuleDepCheck" \
        --compiler_flags="--jscomp_error=undefinedVars" \
        --compiler_flags="--jscomp_error=unknownDefines" \
        --compiler_flags="--jscomp_error=visibility"'
));
