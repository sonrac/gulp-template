const gulp = require('gulp'),
    _config = require(__dirname + "/config.js"),
    imagemin = require('gulp-imagemin'),
    sass = require('gulp-sass'),
    less = require('gulp-less'),
    rename = require('gulp-rename'),
    minify = require('gulp-clean-css'),
    uglify = require('gulp-uglify'),
    swig = require('gulp-swig'),
    livereload = require('gulp-livereload'),
    connect = require('gulp-connect'),
    zip = require('gulp-zip'),
    fs = require('fs'),
    plumber = require("gulp-plumber"),
    series = require('gulp-series'),
    rsync = require('rsyncwrapper');

let template = undefined;

if (_config.template) {
    template = require(_config.template);
}

let buildTemplateOptions = (options) => {
    let RetOptions = {};
    if (typeof options !== 'object') {
        return {};
    }

    for (let i in options) {
        if (!options.hasOwnProperty(i)) {
            continue;
        }

        if (typeof options[i] === 'object') {
            RetOptions[i] = buildTemplateOptions(options[i]);
        }

        if (typeof options[i].indexOf === 'function' && options[i].indexOf('-----timestamp------') !== -1) {
            RetOptions[i] = options[i].replace('-----timestamp------', Date.now);
        } else {
            RetOptions[i] = options[i];
        }
    }

    return RetOptions;
};

let buildStyles = (compiler, ext, path) => {

    let paths = [
        _config.dist_dir + '/' + path + '/*.' + ext,
        '!' + _config.dist_dir + '/' + path + '/_*.' + ext,
    ];

    if (typeof _config.skip === "object") {
        for (let i in _config.skip_styles_dir) {
            if (_config.skip_styles_dir[i][0] !== '!') {
                _config.skip_styles_dir[i] = '!' + _config.skip_styles_dir[i];
            }

            paths.push(_config.skip_styles_dir  [i]);
        }
    }

    return gulp.src(paths)
        .pipe(compiler({
            paths: [_config.dist_dir + '/' + path + '']
        }).on('error', console.log))
        .pipe(plumber())
        .pipe(gulp.dest(_config.build_dir + '/' + _config.css_path + ''))
        .pipe(livereload(_config.livereload_options || {}))
};


series.registerTasks({
    'connect': (() => {
        let serverRoot = _config.server_root_path || __dirname;
        return connect.server({
            root: [serverRoot],
            port: _config.listen_port || 8080
        });
    }),
    'less': (() => {
        if (!_config.less_path) {
            return;
        }

        return buildStyles(less, 'less', _config.less_path);
    }),
    'sass': () => {
        if (!_config.sass_path) {
            return;
        }

        return buildStyles(sass, 'scss', _config.sass_paths);
    },
    'minify-js': (() => {
        if (!_config.copy_js_files) {
            return;
        }

        if (!_config.js_path) {
            return;
        }

        let rsyncOptions = {
            recursive: true,
            syncDest: true,
            delete: _config.delete_files,
            args: ['--verbose'],
            dest: _config.build_dir,
            src: _config.dist_dir + '/' + _config.js_path,
        };

        if (_config.copy_js_files) {
            rsync(rsyncOptions, function () {
            });
        }

        gulp.src([
            _config.dist_dir + '/' + _config.js_path + '/**/**/**/**/**/**/**/**/**/**/*.js',
            '!' + _config.dist_dir + '/' + _config.js_path + '/**/**/**/**/**/**/**/**/**/**/*.min.js'
        ])
            .pipe(uglify().on('error', console.log))
            .pipe(rename({
                suffix: '.min'
            }))
            .pipe(plumber())
            .pipe(gulp.dest(_config.build_dir + '/' + _config.js_path + '/'))
            .pipe(livereload(_config.livereload_options || {}));
    }),
    'minify-css': (() => {
        gulp.src([
            _config.build_dir + '/' + _config.css_path + '/**/**/**/**/**/**/**/**/**/**/*.css',
            '!' + _config.build_dir + '/' + _config.css_path + '/**/**/**/**/**/**/**/**/**/**/*.min.css',
        ]).pipe(minify({compatibility: 'ie9'}).on('error', console.log))
            .pipe(rename({
                suffix: '.min'
            }))
            .pipe(plumber())
            .pipe(gulp.dest(_config.build_dir + '/' + _config.css_path))
            .pipe(livereload(_config.livereload_options || {}));
    }),
    'templates': (() => {
        let options = buildTemplateOptions(_config.template_options);

        if (!_config.dist_templates_path) {
            return;
        }

        if (!fs.existsSync(_config.dist_dir + '/' + _config.dist_templates_path)) {
            return;
        }

        let templateFiles = [],
            i,
            pathTemplate = _config.dist_dir + '/' + _config.dist_templates_path + '/**/**/**/**/**/**/**/**/**/**/*.::extension::',
            exts = (typeof _config.template_extensions === "object") ? _config.template_extensions : [_config.template_extensions];

        for (i in exts) {
            if (exts.hasOwnProperty(i) && typeof (exts[i]) === "string") {
                templateFiles.push(pathTemplate.replace('::extension::', exts[i]));
            }
        }

        if (typeof _config.skip_templates_dir === "object") {
            for (i in _config.skip_templates_dir) {
                if (_config.skip_templates_dir.hasOwnProperty(i)) {
                    if (_config.skip_templates_dir[i][0] !== '!') {
                        _config.skip_templates_dir[i] = '!' + _config.skip_templates_dir[i];
                    }
                    templateFiles.push(_config.skip_templates_dir[i]);
                }
            }
        }

        gulp.src(
            templateFiles
        )
            .pipe(template(options).on('error', console.log))
            .pipe(gulp.dest(_config.build_dir + '/' + _config.build_template_path))
            .pipe(plumber())
            .pipe(livereload(_config.livereload_options || {}));
    }),
    'copy': (() => {
        "use strict";
        if (!(typeof _config.copyPaths === "object")) {
            return;
        }

        let paths = _config.copyPaths;

        for (let i in paths) {
            if (paths.hasOwnProperty(i)) {
                let rsyncOptions = {
                    recursive: true,
                    syncDest: true,
                    delete: true,
                    args: ['--verbose'],
                    dest: i,
                    src: paths[i]
                };

                rsync(rsyncOptions, function () {
                });
            }
        }

    }),
    'images': (() => {
        if (!_config.images_path) {
            return;
        }
        return gulp.src(_config.dist_dir + '/' + _config.images_path + '/**/**/**/**/**/**/**/**/**/**/*')
            .pipe(imagemin())
            .pipe(plumber())
            .pipe(gulp.dest(_config.build_dir + '/' + _config.images_path + ''));
    }),
    'watch': (() => {
        livereload.listen(_config.livereload_options);
        gulp.watch(_config.dist_dir + '/' + _config.less_path + '/**/**/**/**/**/**/**/**/**/**/*.less', ['less']);
        gulp.watch(_config.dist_dir + '/' + _config.sass_path + '/**/**/**/**/**/**/**/**/**/**/*.scss', ['sass']);

        if (_config.images_path) {
            gulp.watch(_config.dist_dir + '/' + _config.images_path + '/**/**/**/*', ['images']);
        }

        if (_config.template) {
            let templateFiles = [],
                i = 0,
                pathTemplate = _config.dist_dir + '/' + _config.dist_templates_path + '/**/**/**/**/**/**/**/**/**/**/*.::extension::',
                exts = (typeof _config.template_extensions === "object") ? _config.template_extensions : [_config.template_extensions];

            for (i in exts) {
                if (exts.hasOwnProperty(i) && typeof (exts[i]) === "string") {
                    templateFiles.push(pathTemplate.replace('::extension::', exts[i]));
                }
            }

            let t = [];
            for (i in templateFiles) {
                if (templateFiles.hasOwnProperty(i)) {
                    t.push(templateFiles[i]);
                }
            }

            gulp.watch(t, ['templates']);
        }

        gulp.watch([
            _config.build_dir + '/' + _config.css_path + '/**/**/**/**/**/**/**/**/**/**/*.css',
            _config.dist_dir + '/' + _config.css_path + '/**/**/**/**/**/**/**/**/**/**/*.css',
            '!' + _config.build_dir + '/' + _config.css_path + '/**/**/**/**/**/**/**/**/**/**/*.min.css',
            '!' + _config.dist_dir + '/' + _config.css_path + '/**/**/**/**/**/**/**/**/**/**/*.min.css',
        ], ['minify-css']);
        gulp.watch([
            _config.build_dir + '/' + _config.js_path + '/**/**/**/**/**/**/**/**/**/**/*.js',
            _config.dist_dir + '/' + _config.js_path + '/**/**/**/**/**/**/**/**/**/**/*.js',
            '!' + _config.build_dir + '/' + _config.js_path + '/**/**/**/**/**/**/**/**/**/**/*.min.js',
            '!' + _config.dist_dir + '/' + _config.js_path + '/**/**/**/**/**/**/**/**/**/**/*.min.js',
        ], ['minify-js']);
    }),
    'release': (() => {
        gulp.src([_config.build_dir + '/**/**/**/**/**/**/**/**/**/**/*'])
            .pipe(zip('release.zip'))
            .pipe(gulp.dest('.'));
    }),
});

series.registerSeries('minify-css', ['less', 'sass', 'minify-css']);
// series.registerSeries('watch', ['watch']);
series.registerSeries('build', ['minify-css', 'templates', 'minify-js', 'images']);
series.registerSeries('default', ['watch', 'less', 'sass', 'connect', 'templates', 'minify-css', 'minify-js', 'images', 'copy']);