/**
 * @author Donii Sergii <doniysa@gmail.com>
 */

/**
 * @ignore _
 * @ignore gulp
 * @ignore watch
 * @ignore plumber
 * @ignore sourcemaps
 * @ignore livereload
 * @ignore minify
 */

const baseBuild  = require('./BaseBuild'),
      _          = require('lodash'),
      gulp       = require('gulp'),
      plumber    = require('gulp-plumber'),
      watch      = gulp.watch,
      rename     = require('gulp-rename'),
      livereload = require('gulp-livereload'),
      minify     = require('gulp-minify-html')

/**
 * @class Templates
 * @extends BaseBuild
 * Build templates. Only pug testing support
 *
 * @property {Object|Array|String} paths Config path. See <a href="global.html#pathConfig">For detail</a>
 * @property {Array} ignores Ignores pattern which will be adding to all <code>gulp.src</code> functions for css build
 * @property {String} processor NPM package name which will be require for this config section
 * @property {String} sourceExt Source filename extension
 * @property {String} outputExt Output filename extension. If empty, set sourceExt
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
 * @property {Object} configPaths Default path from config
 * @property {Object|Array} ignores Ignore files pattern
 * @property {String|Array} defMinifyTasks Defaults tasks which run on minify
 *
 * @author Donii Sergii<doniysa@gmail.com>
 */
class Templates extends baseBuild {

  /**
   * Getter for default processor
   *
   * @returns {string}
   *
   * @author Donii Sergii<doniysa@gmail.com>
   */
  get defaultProcessor () {
    return 'gulp-less'
  }

  /**
   * Getter for default build tasks
   *
   * @returns {string}
   *
   * @author Donii Sergii<doniysa@gmail.com>
   */
  get defTasks () {
    return 'templates'
  }

  /**
   *  Get default minify task
   * @returns {string}
   */
  get defMinifyTasks () {
    return 'minify-js'
  }

  /**
   * Run build task
   *
   * @param {String} path
   *
   * @author Donii Sergii<doniysa@gmail.com>
   */
  runBuildTask (path) {

    if (_.isString(path.src)) {
      path.src = [path.src]
    }

    if (_.isString(path.des)) {
      path.src = [path.desc]
    }

    if (_.isArray(this.ignores)) {
      _.each(this.ignores, (_path) => {
        path.src.push(_path[0] === '!' ? _path : '!' + _path)
      })
    }

    let task = gulp.src(path.src)
      .pipe(this.processor(this.processorOptions).on('error', console.log))
      .pipe(plumber())
      .pipe(gulp.dest(path.dest))
      .pipe(livereload(this.liveReloadOptions))

    task.on('error', console.log)
  }

  /**
   * Check processor instance
   *
   * @returns {String}
   *
   * @author Donii Sergii<doniysa@gmail.com>
   */
  checkProcessor () {
    return this.processor
  }

  /**
   * Run minify task for path
   *
   * @param {{src: {String}, dest: {String}}} path Next build path
   *
   * @author Donii Sergii<doniysa@gmail.com>
   */
  runMinify (path) {
    let task = gulp.src([
      path.dest + '/*.html',
      '!' + path.dest + '/*.min.html',
    ])
      .pipe(minify(this.minifyOptions).on('error', console.log))
      .pipe(plumber())
      .pipe(rename({
        suffix: this.minifySuffix
      }))
      .pipe(gulp.dest(path.dest))
      .pipe(livereload(this.liveReloadOptions))
    task.on('error', console.log)
  }
}

module.exports = Templates