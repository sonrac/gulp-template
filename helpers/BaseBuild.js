/**
 * @author Donii Sergii <doniysa@gmail.com>
 */

const pathBuild = require('./PathBuild'),
      _         = require('lodash');

/**
 * @class @abstract BaseBuild
 * Abstract class for building
 *
 * @property {Object|Array|String} paths Config path. See <a href="global.html#pathConfig">For detail</a>
 * @property {Array} ignores Ignores pattern which will be adding to all <code>gulp.src</code> functions for css build
 * @property {String} processor NPM package name which will be require for this config section
 * @property {Object} liveReloadOptions <a target="_blank" href=https://github.com/vohof/gulp-livereload>Livereload</a> options for css building
 * @property {Function|undefined} additionalMinifyWatchCallback Additional minify watch callback. Called on <a href="Css.html">Css class</a>
 * @property {Function|undefined} additionalBuildCallback Additional build callback. Called on <a href="Css.html">Css class</a>
 * @property {Function|undefined} additionalWatchCallback Additional watch callback. Called on <a href="Css.html">Css class</a>
 * @property {Function|undefined} additionalMinifyWatchCallback Additional minify watch callback. Called on <a href="Css.html">Css class</a>
 * @property {Function|undefined} minifyOptions Options for <a target="_blank" href="https://www.npmjs.com/package/gulp-clean-css">gulp-clean-css</a> package
 * @property {String|undefined} minifySuffix Minify suffix for min file versions. By default is <code>.min</code>
 * @property {String|Array} watchTasks Task which will be run on build files watcher. Be default is <code>build-css</code>
 * @property {String|Array} watchMinifyTasks Task which will be run on minify files watcher. Be default is <code>minify-css</code>
 * @property {Array|Object} additionalMinifyPath Additional minify files pattern which will be adding to all <code>gulp.src</code> functions for minify css. See <a href="global.html#pathConfig">Path config options</a> for detail
 * @property {Boolean} enableMin Enable or disable run minify task & watcher. By default is true
 * @property {Object} processorOptions Options for gulp package which will be build css. Testing on <a target="_blank" href="https://github.com/stevelacy/gulp-stylus">gulp-stylus</a>, <a target="_blank" href="https://github.com/dlmanning/gulp-sass">gulp-sass</a> and <a target="_blank" href="https://github.com/stevelacy/gulp-less">gulp-less</a>
 * @property {Object} originalConfig Config which giving in constructor
 * @property {String} processorName Package name for build
 * @property {Object|Array} paths Paths
 * @property {Object|Array} processorOptions Processor options
 * @property {Array} tasks Additional task for build watcher
 * @property {Array|Object|undefined} additionalMinifyPath Additional minify paths
 * @property {Array|Object|undefined} additionalMinifyWatchCallback Additional minify watch paths
 * @property {Array|Object|undefined} additionalBuildCallback Additional build paths config
 * @property {Array|Object|undefined} additionalBuildCallback Additional build paths config
 * @property {Array|Object|undefined} minifyOptions Options for gulp-clean-css package
 * @property {Function|undefined} additionalMinifyWatchCallback Additional minify watch callback
 * @property {Function|undefined} additionalMinifyCallback Additional minify callback
 * @property {String} minifySuffix Suffix for minified files
 * @property {String} defaultProcessor Default processor
 * @property {String|Array} defTasks Default run tasks
 * @property {String|Array} watchTasks Watch tasks for build paths
 * @property {String|Array} watchMinifyTasks Watch tasks for minify paths
 * @property {{outDir: {String}, distDir: {String}}} configPaths Default path from config
 * @property {Object|Array} ignores Ignore files pattern
 *
 * @author Donii Sergii<doniysa@gmail.com>
 */
class BaseBuild {

    /**
     * BaseBuild constructor
     *
     * @param {Object} config CSS compiler config
     * @param {Object} liveReloadOptions Livereload options
     * @param {{outDir: {String}, distDir: {String}}} configPaths Default config paths
     *
     * @author Donii Sergii<doniysa@gmail.com>
     */
    constructor(config, liveReloadOptions, configPaths) {
        if (new.target === BaseBuild) {
            throw new TypeError("Cannot construct BaseBuild instances directly");
        }
        this.originalConfig = config;
        this.configPaths    = configPaths;

        this.processorName    = config.processor || this.defaultProcessor;
        this.paths            = config.paths;
        this.processorOptions = config.processorOptions;

        if (_.isString(this.processorName)) {
            this.processor = require(this.processorName);
        }

        this.ignores          = config.ignorePatterns;
        this.watchTasks       = config.watchTasks || this.defTasks;
        this.watchMinifyTasks = config.watchMinifyTasks || this.defTasks;
        if (_.isString(this.watchTasks)) {
            this.watchTasks = [this.watchTasks];
        }
        if (_.isString(this.watchMinifyTasks)) {
            this.watchMinifyTasks = [this.watchMinifyTasks];
        }
        this.liveReloadOptions             = (config.liveReloadOptions || (liveReloadOptions || {}));
        this.additionalMinifyPath          = config.externalMinifyPath;
        this.additionalBuildCallback       = config.buildCallback;
        this.additionalWatchCallback       = config.buildWatchCallback;
        this.additionalMinifyWatchCallback = config.buildMinifyWatchCallback;
        this.additionalMinifyCallback      = config.minifyCallback;

        this.minifyOptions = config.minifyOptions || {
                compatibility: 'ie9'
            };

        this.minifySuffix = config.suffix || '.min';
        this.enableMin    = config.enableMin || true;
    }

    /**
     * Get build paths
     *
     * @returns {Object}
     *
     * @author Donii Sergii<doniysa@gmail.com>
     */
    getBuildPaths() {
        let currentPaths = (new pathBuild(this.paths, this.defaultOutPath, this.configPaths)).processFullPath(true);
        if (!currentPaths.length) {
            return [];
        }

        return currentPaths;
    }

    /**
     * Check processor set
     *
     * @returns {boolean}
     *
     * @author Donii Sergii<doniysa@gmail.com>
     */
    checkProcessor() {
        return true;
    }

    /**
     * Build task
     *
     * @author Donii Sergii<doniysa@gmail.com>
     */
    build() {
        let _self = this,
            paths = this.getBuildPaths();

        if (!_.size(paths)) {
            return;
        }

        if (!this.checkProcessor()) {
            return;
        }

        _.each(paths, (path) => {
            _self.runBuildTask.apply(_self, [path]);
        });

        if (_.isFunction(this.additionalBuildCallback)) {
            this.additionalBuildCallback.apply(this);
        }
    }

    /**
     * Generate paths
     *
     * @param {Object|Array} _paths Arrays
     *
     * @author Donii Sergii<doniysa@gmail.com>
     */
    runForPaths(_paths) {
        let _self = this;
        if (_.size(_paths)) {
            _.each(_paths, (path) => {
                _self.runMinify.apply(_self, [path]);
            });
        }
    }

    /**
     * Run watcher for build
     *
     * @author Donii Sergii<doniysa@gmail.com>
     */
    buildWatch() {
        if (!_.size(paths = this.getBuildPaths())) {
            return;
        }

        let _self = this;

        _.each(paths, (path) => {
            watch(path, _self.watchBuildTasks);
        });

        if (_.isFunction(this.additionalWatchCallback.apply(this))) {
            this.additionalWatchCallback.apply(this);
        }

        this.minifyWatch();
    }

    /**
     * Run watcher for minify task
     *
     * @author Donii Sergii<doniysa@gmail.com>
     */
    minifyWatch() {

        if (!this.enableMin) {
            return;
        }

        if (_.isFunction(this.additionalMinifyWatchCallback)) {
            this.additionalMinifyWatchCallback.apply(this);
        }

        let paths = (new pathBuild(this.paths, this.defaultOutPath, this.configPaths)).processFullPath();

        if (!_.size(paths)) {
            return;
        }

        let _self = this;

        _.each(paths, (path) => {
            watch(path, _self.watchMinifyTasks);
        });

        if (_.isFunction(this.additionalWatchCallback)) {
            this.additionalWatchCallback.apply(this);
        }

    }

    /**
     * Run minify-css task
     *
     * @author Donii Sergii<doniysa@gmail.com>
     */
    minify() {
        if (!this.enableMin) {
            return;
        }

        let additionalPaths = (new pathBuild(this.additionalMinifyPath, this.configPaths)).processFullPath(),
            currentPaths    = (new pathBuild(this.paths, this.defaultOutPath, this.configPaths)).processFullPath(true),
            _self           = this;

        if (!_.size(currentPaths) && !_.size(additionalPaths)) {
            return;
        }

        if (_.isFunction(this.additionalMinifyCallback)) {
            this.additionalMinifyCallback(this);
        }

        _self.runForPaths(currentPaths);
        _self.runForPaths(additionalPaths);
    }
}

module.exports = BaseBuild;