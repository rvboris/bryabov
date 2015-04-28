var gulp = require('gulp');
var ftp = require('vinyl-ftp');
var $ = require('gulp-load-plugins')();

gulp.task('styles', function () {
    return gulp.src('app/styles/main.styl')
        .pipe($.changed('.tmp/styles'))
        .pipe($.stylus())
        .pipe($.autoprefixer({
            browsers: ['last 2 version']
        }))
        .pipe(gulp.dest('.tmp/styles'));
});

gulp.task('eslint', function () {
    return gulp.src('app/scripts/**/*.js')
        .pipe($.eslint({
            configFile: '.eslintrc'
        }))
        .pipe($.eslint.format())
        .pipe($.eslint.failOnError());
});

gulp.task('jscs', function () {
    return gulp.src('app/scripts/**/*.js').pipe($.jscs());
});

gulp.task('jsonlint', function () {
    gulp.src('app/languages/*.json')
        .pipe($.jsonlint())
        .pipe($.jsonlint.reporter());
});

gulp.task('html', ['styles'], function () {
    var assets = $.useref.assets({
        searchPath: '{.tmp,app}'
    });

    return gulp.src('app/*.html')
        .pipe(assets)
        .pipe($.if('*.js', $.stripDebug()))
        .pipe($.if('*.js', $.uglify()))
        .pipe($.if('*.css', $.uncss({
            html: ['app/index.html'],
            ignore: [
                '.pie-chart canvas',
                /.wf-active/,
                /.mfp/,
                /#languages/,
                /#contact-form/,
                /fa-check-circle-o/,
                /fa-times-circle/
            ]
        })))
        .pipe($.if('*.css', $.shorthand()))
        .pipe($.if('*.css', $.csso()))
        .pipe($.rev())
        .pipe(assets.restore())
        .pipe($.useref())
        .pipe($.if('*.html', $.minifyHtml({
            conditionals: true,
            loose: true
        })))
        .pipe($.revReplace())
        .pipe(gulp.dest('dist'));
});

gulp.task('images', function () {
    return gulp.src('app/images/**/*')
        .pipe($.cache($.imagemin({
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest('dist/images'));
});

gulp.task('fonts', function () {
    return gulp.src(require('main-bower-files')().concat('app/fonts/**/*'))
        .pipe($.filter('**/*.{eot,svg,ttf,woff,woff2}'))
        .pipe($.flatten())
        .pipe(gulp.dest('dist/fonts'));
});

gulp.task('extras', function () {
    return gulp.src([
        'app/languages/*.json',
        'app/*.ico'
    ], {
        base: 'app'
    }).pipe(gulp.dest('dist'));
});

gulp.task('clean', require('del').bind(null, ['.tmp', 'dist']));

gulp.task('connect', function () {
    var serveStatic = require('serve-static');
    var serveIndex = require('serve-index');
    var app = require('connect')()
        .use(require('connect-livereload')({
            port: 35729
        }))
        .use(serveStatic('.tmp'))
        .use(serveStatic('app'))
        .use('/bower_components', serveStatic('bower_components'))
        .use('/node_modules', serveStatic('node_modules'))
        .use(serveIndex('app'));

    require('http').createServer(app)
        .listen(9000)
        .on('listening', function () {
            console.log('Started connect web server on http://localhost:9000');
        });
});

gulp.task('serve', ['connect', 'watch'], function () {
    require('opn')('http://localhost:9000');
});

gulp.task('wiredep', function () {
    var wiredep = require('wiredep').stream;

    gulp.src('app/*.html')
        .pipe(wiredep({
            exclude: [
                /lodash/,
                /requirejs/,
                /get-style-property/,
                /isotope/,
                /matches-selector/,
                /doc-ready/,
                /outlayer/,
                /masonry/,
                /get-size/,
                /google-open-sans/
            ],
        }))
        .pipe(gulp.dest('app'));
});

gulp.task('watch', ['connect'], function () {
    $.livereload.listen();

    gulp.watch([
        'app/*.html',
        '.tmp/styles/**/*.css',
        'app/scripts/**/*.js',
        'app/images/**/*'
    ]).on('change', $.livereload.changed);

    gulp.watch('app/styles/**/*.styl', ['styles']);
    gulp.watch('bower.json', ['wiredep']);
});

gulp.task('build', ['eslint', 'jsonlint', 'jscs', 'html', 'images', 'fonts', 'extras'], function () {
    return gulp.src('dist/**/*').pipe($.size({
        title: 'build',
        gzip: true
    }));
});

gulp.task('default', ['clean'], function () {
    gulp.start('build');
});

gulp.task('deploy', ['build'], function () {
    var deployConfig = require('./deploy-config.json');

    var conn = ftp.create({
        host: deployConfig.host,
        user: deployConfig.user,
        password: deployConfig.password,
        parallel: 5,
        log: $.util.log
    });

    return gulp.src(['dist/**'], {
            base: 'dist/',
            buffer: false
        })
        .pipe(conn.newerOrDifferentSize('/bryabov'))
        .pipe(conn.dest('/bryabov'));
});