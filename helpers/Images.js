/**
 * @author Donii Sergii <doniysa@gmail.com>
 */

const gulp       = require('gulp'),
      _          = require('lodash'),
      plumber    = require('gulp-plumber'),
      livereload = require('gulp-livereload'),
      changed    = require('gulp-changed'),
      pathBuild  = require("./PathBuild");

/**
 * @class Images
 * Images build class
 *
 * @property {String} distDir Default config destination dir
 * @property {String} outDir Default config output dir
 * @property {Object|Array} paths Paths config
 * @property {String} processorName Processor minify name (default is `gulp-imagemin`)
 * @property {Function} processor Processor function (get from initialiaze as `require(this.processorName)`
 * @property {Object} liveReloadOptions Livereload options plugin
 * @property {Object} processorOptions Processor options
 * @property {String} distDir Distributive folder from config
 * @property {String} outDir Output folder from config
 *
 * @author Donii Sergii<doniysa@gmail.com>
 */
class Images {

    /**
     * Images contructor
     *
     * @param {Object} config Class config
     * @param {Object} liveReloadOptions Livereload options
     * @param {Object|Array} paths Default config paths
     *
     * @author Donii Sergii<doniysa@gmail.com>
     */
    constructor(config, liveReloadOptions, paths) {
        this.distDir           = paths.distDir;
        this.outDir            = paths.outDir;
        this.paths             = config.paths;
        this.processorName     = config.processor || 'gulp-imagemin';
        this.processor         = require(this.processorName);
        this.livereloadOptions = liveReloadOptions || {};
        this.processorOptions  = config.processorOptions || {
                interlaced       : true,
                progressive      : true,
                optimizationLevel: 5,
                svgoPlugins      : [{removeViewBox: true}]
            };
    }

    /**
     * Run image minify task
     *
     * @param {{src: {String}, dest: {String}}} path Next path for minify
     *
     * @author Donii Sergii<doniysa@gmail.com>
     */
    runImageMinify(path) {
        let task = gulp.src(path.src)
            .pipe(plumber())
            .pipe(this.processor(this.processorOptions).on('error', console.log))
            // .pipe(changed(path.dest))
            .pipe(gulp.dest(path.dest))
            .pipe(livereload(this.liveReloadOptions));

        task.on('error', console.log);
    }

    /**
     * Run minify task
     *
     * @author Donii Sergii<doniysa@gmail.com>
     */
    minify() {
        let paths = (new pathBuild(this.paths, this.outDir)).processFullPath(),
            _self = this;

        if (!_.size(paths)) {
            return;
        }

        _.each(paths, function (path) {
            _self.runImageMinify.apply(_self, [path]);
        });
    }

}

module.exports = Images;