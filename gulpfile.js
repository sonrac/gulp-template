const gulp = require('gulp'),
    imagemin = require('gulp-imagemin'),
    sass = require('gulp-sass'),
    connect = require('gulp-connect'),
    less = require('gulp-less'),
    rename = require('gulp-rename'),
    minify = require('gulp-clean-css'),
    uglify = require('gulp-uglify'),
    swig = require('gulp-swig'),
    pump = require('pump'),
    livereload = require('gulp-livereload'),
    zip = require('gulp-zip'),
    pug = require('gulp-pug');

gulp.task('connect', () =>
    connect.server({
        root: ['app', '.tmp']
    })
);

gulp.task('less', () =>
    gulp.src(['app/dist/less/*.less', '!less/_*.less'])
        .pipe(less({
            paths: [__dirname + '/app/dist/less']
        }))
        .pipe(gulp.dest('app/build/css'))
        .pipe(livereload())
);

gulp.task('minify-js', (cb) => {
    pump([
            gulp.src('app/build/css/**/**/**/*.js'),
            uglify(),
            gulp.dest('app/build/js/min')
        ],
        cb
    );
});

gulp.task('minify-css', (cb) => {
    pump([
            gulp.src('app/build/css/**/**/**/*.css'),
            minify({compatibility: 'ie9'}),
            gulp.dest('app/build/css/min')
        ],
        cb
    );
})

gulp.task('sass', () =>
    gulp.src(['app/dist/sass/*.scss', '!sass/_*.scss'])
        .pipe(sass({
            paths: [__dirname + '/app/dist/sass']
        }))
        .pipe(gulp.dest('app/build/css'))
        .pipe(livereload())
);

gulp.task('templates', () =>
    gulp.src(['app/build/templates/**/**/**/*.html', '!**/_*.html'])
        .pipe(swig({defaults: {cache: false}}))
        .pipe(gulp.dest('.tmp'))
        .pipe(livereload())
);

gulp.task('images', () => {
    gulp.src('app/dist/images/**/**/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest('app/build/images'))
});

gulp.task('pug', () => {
    gulp.src(['app/dist/templates/**/**/**/**/**/**/*.pug', 'templates/**/**/**/**/**/**/**/*.jade'])
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest('app/build/html'))
        .pipe(livereload());
});

gulp.task('watch', ['connect'], () => {
    livereload.listen();
    gulp.watch('app/dist/less/**/**/**/*.less', ['less']);
    gulp.watch('app/dist/sass/**/**/**/*.scss', ['sass']);
    gulp.watch('app/dist/js/**/**/**/*.less', ['less']);
    gulp.watch('app/dist/images/**/**/**/*', ['images']);
    gulp.watch('templates/pug/**/**/**/*.pug', ['templates']);
    gulp.watch('templates/*.html', ['templates']);
    gulp.watch('app/build/css/*.css', ['minify-css']);
    gulp.watch('app/build/js/*.js', ['minify-js']);
});

gulp.task('release', ['build'], () => {
    gulp.src(['app/build/**/**/**/**/**/**/**/**/**/**/*'])
        .pipe(zip('release.zip'))
        .pipe(gulp.dest('.'));
});

gulp.task('build', ['less', 'templates', 'minify-css', 'minify-js', 'sass', 'images']);
gulp.task('server', ['build', 'watch']);
gulp.task('default', ['build']);