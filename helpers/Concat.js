/**
 * @author Donii Sergii <doniysa@gmail.com>
 */

/**
 * @ignore _
 * @ignore rename
 * @ignore cleanCSS
 * @ignore concat
 */
const _            = require('lodash'),
      gulp         = require('gulp'),
      pathBuilder  = require("./PathBuild"),
      plumber      = require('gulp-plumber'),
      babel        = require('gulp-babel'),
      sourcemaps   = require('gulp-sourcemaps'),
      livereload   = require('gulp-livereload'),
      rename       = require('gulp-rename'),
      cleanCSS     = require('gulp-clean-css'),
      uglify       = require('gulp-uglify'),
      pathObj      = require('path'),
      autoprefixer = require('gulp-autoprefixer'),
      concat       = require('gulp-concat');

let _start = false;

/**
 * @class Concat
 * Concatenate files
 *
 * @property {Object} liveReloadOptions <a target="_blank" href=https://github.com/vohof/gulp-livereload>Livereload</a> options for concat building
 * @property {Object|Array} paths Config path. See <a href="global.html#pathConfig">For detail</a>
 * @property {String} distDir Distributive folder from config
 * @property {String} outDir Output folder from config
 * @property {Boolean} useAMD Build amd application flag
 * @property {Object} concatOptions Concatenate options
 * @property {Boolean} useAMD
 */
class Concat {

    /**
     * Concat constructor
     * @param {Object} options Concat options
     * @param {Object} liveReloadOptions <a target="_blank" href=https://github.com/vohof/gulp-livereload>Livereload</a> options for concat building
     * @param {{outDir: {String}, distDir: {String}}} defPaths Defined path from config
     * @param {Boolean} useAMD Use amd build
     */
    constructor(options, liveReloadOptions, defPaths, useAMD) {
        defPaths               = defPaths || {};
        this.liveReloadOptions = liveReloadOptions || {};
        this.paths             = options.paths;
        this.outDir            = defPaths.outDir;
        this.distDir           = defPaths.distDir;
        this.concatOptions     = options.concatOptions;
        this.useAMD            = useAMD || false;
        this.configFile        = options.configFile;
        this.sourcePath        = options.sourcePath;
        this.minPath           = options.minPath;
        this.babelOptions      = options.babelOptions || {
                presets: ['es2015']
            };
        this.minifyOptions     = options.minifyOptions || {};
        this.uglifyOptions     = options.uglifyOptions || {};
        this.minifySuffix      = options.minifySuffix || '.min';
        this.autoprefixOptions = options.autoprefixOptions || {
                browsers: ['last 7 versions'],
                cascade : true
            };

        this.processPath();
    }

    /**
     * Process parse paths
     */
    processPath() {

        let paths = [];
        _.each(this.paths, (path, dest) => {
            paths.push({
                dest: dest,
                src : path
            });
        });

        this.paths = (new pathBuilder(paths, this.outDir, {
            distDir: this.distDir,
            outDir : this.outDir
        }, true)).processFullPath(true);

        if (!_.isArray(this.paths)) {
            this.paths = [this.paths];
        }
    }

    /**
     * Add to task
     *
     * @param {String|Array} path Source path
     * @param {String|RegExp} regex Regexp object
     * @param {Function} callback Callable function
     * @param {undefined|Array} callbackParams Options for callback
     *
     * @return {Boolean}
     */
    addToTasks(path, regex, callback, callbackParams) {
        regex = _.isString(regex) ? regex : new RegExp(regex);
        if (_.isArray(path)) {
            let answer;
            for (let i in path) {
                if (!path.hasOwnProperty(i)) {
                    continue;
                }

                if (answer = this.addToTasks(path[i], regex, callback, callbackParams)) {
                    return answer;
                }

            }
        } else {
            if (path.match(regex)) {
                return callback.apply(this, callbackParams || []);
            }
        }

        return false;
    }

    /**
     * Run concatenate files
     */
    build() {
        if (!_.size(this.paths)) {
            return;
        }

        _start = true;

        let _self = this;

        _.each(this.paths, (path, index) => {
            _self.concatOptions      = _self.concatOptions || {};
            _self.concatOptions.path = path.src;
            let _gulp = gulp.src(path.src)
                .pipe(sourcemaps.init()),
                answer = undefined;
            if (answer = _self.addToTasks.apply(_self, [path.src, /\.css$/, (path, gulp) => {
                    return gulp.pipe(autoprefixer(_self.autoprefixOptions));
                }, [path, _gulp]])) {
                _gulp = answer;
            }
            if (answer = _self.addToTasks.apply(_self, [path.src, /\.js$/, (path, gulp) => {
                    return gulp.pipe(babel(_self.babelOptions));
                }, [path, _gulp]])) {
                _gulp = answer;
            }
            _gulp = _gulp.pipe(plumber())
                .pipe(concat(pathObj.basename(path.dest), _self.concatOptions || {}))
                .pipe(livereload(_self.liveReloadOptions));

            _gulp.pipe(sourcemaps.write('.'))
                .pipe(gulp.dest(pathObj.dirname(path.dest)));
        });
    }

    concatAmd() {

    }

    /**
     * Run minify files
     */
    minify() {
        if (!_.size(this.paths)) {
            return;
        }

        let _self = this;

        _.each(this.paths, (path, index) => {
            let _gulp = gulp.src(path.dest)
                .pipe(sourcemaps.init())
                .pipe(plumber())
                .pipe(livereload(_self.liveReloadOptions)),
                answer = undefined;

            if (answer = _self.addToTasks.apply(_self, [path.dest, /\.css$/, (path, gulp) => {
                    return _gulp.pipe(cleanCSS(_self.minifyOptions).on('error', console.log));
                }, [path, _gulp]])) {
                _gulp = answer;
            }
            if (answer = _self.addToTasks.apply(_self, [path.dest, /\.js$/, (path, gulp) => {
                    return gulp.pipe(uglify(_self.uglifyOptions).on('error', console.log));
                }, [path, _gulp]])) {
                _gulp = answer;
            }
            _gulp.pipe(rename({
                suffix: _self.minifySuffix
            }))
                .pipe(sourcemaps.write('.').on('error', console.log))
                .pipe(gulp.dest(pathObj.dirname(path.dest)));
        });
    }

    /**
     * Run watch files changed
     */
    buildWatch() {

    }

    /**
     * Watch changed source files for minified
     */
    minifyWatch() {
    }
}


module.exports = Concat;