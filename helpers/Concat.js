/**
 * @author Donii Sergii <doniysa@gmail.com>
 */

/**
 * @ignore _
 * @ignore rename
 * @ignore cleanCSS
 * @ignore concat
 * @ignore rjs
 * @ignore uglify
 * @ignore plumber
 * @ignore babel
 * @ignore autoprefixer
 */
const _            = require('lodash'),
      gulp         = require('gulp'),
      PathBuilder  = require('./PathBuild'),
      plumber      = require('gulp-plumber'),
      babel        = require('gulp-babel'),
      sourcemaps   = require('gulp-sourcemaps'),
      livereload   = require('gulp-livereload'),
      rename       = require('gulp-rename'),
      cleanCSS     = require('gulp-clean-css'),
      uglify       = require('gulp-uglify'),
      pathObj      = require('path'),
      rJS          = require('gulp-requirejs'),
      autoprefixer = require('gulp-autoprefixer'),
      concat       = require('gulp-concat')

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
   */
  constructor (options, liveReloadOptions, defPaths) {
    defPaths               = defPaths || {}
    this.liveReloadOptions = liveReloadOptions || {}
    this.paths             = options.paths
    this.outDir            = defPaths.outDir
    this.outFile           = options.outFile
    this.distDir           = defPaths.distDir
    this.concatOptions     = options.concatOptions
    this.useAMD            = options.configFile || false
    this.configFile        = options.configFile
    this.sourcePath        = options.sourcePath
    this.minPath           = options.minPath
    this.babelOptions      = options.babelOptions || {
      presets: ['es2015']
    }
    this.minifyOptions     = options.minifyOptions || {}
    this.uglifyOptions     = options.uglifyOptions || {}
    this.minifySuffix      = options.minifySuffix || 'min'
    this.baseUrl           = options.baseUrl || ''
    this.rJSFile           = options.file
    this.autoprefixOptions = options.autoprefixOptions || {
      browsers: ['last 7 versions'],
      cascade : true
    }
    this.rJSOptions        = options.requireJSConfig || {}

    if (this.useAMD) {
      this.buildRJSConfig()
    }

    this.processPath()
  }

  /**
   * Build require JS config
   */
  buildRJSConfig () {
    if (!this.useAMD) {
      return
    }

    this.rJSOptions = _.extend({
      baseUrl: this.baseUrl,
      name   : this.configFile,
      out    : this.outFile
    }, this.rJSOptions)
  }

  /**
   * Process parse paths
   */
  processPath () {

    let paths = []
    _.each(this.paths, (path, dest) => {
      paths.push({
        dest: dest,
        src : path
      })
    })

    this.paths = (new PathBuilder(paths, this.outDir, {
      distDir: this.distDir,
      outDir : this.outDir
    }, true)).processFullPath(true)

    if (!_.isArray(this.paths)) {
      this.paths = [this.paths]
    }

    if (this.useAMD) {
      this.paths.push({
        src : this.rJSOptions.baseUrl + '/' + this.rJSOptions.name,
        dest: this.rJSOptions.baseUrl + '/' + this.rJSOptions.out
      })
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
  addToTasks (path, regex, callback, callbackParams) {
    regex = _.isString(regex) ? regex : new RegExp(regex)
    if (_.isArray(path)) {
      for (let i in path) {
        if (!path.hasOwnProperty(i)) {
          continue
        }

        let answer = this.addToTasks(path[i], regex, callback, callbackParams)

        return answer ? answer : false
      }
    } else {
      if (path.match(regex)) {
        return callback.apply(this, callbackParams || [])
      }
    }

    return false
  }

  /**
   * Run concatenate files
   */
  build () {
    if (!_.size(this.paths)) {
      return
    }

    let _self = this

    _self.concatOptions      = _self.concatOptions || {}
    this.runTask(false, babel, _self.babelOptions, autoprefixer, _self.autoprefixOptions)

  }

  /**
   * Run minify files
   */
  minify () {
    if (!_.size(this.paths)) {
      return
    }

    this.runTask(true, uglify, this.uglifyOptions, cleanCSS, this.minifyOptions)
  }

  runTask (minify, jsProcessor, jsProcOptions, cssProcessor, cssProcessorOptions) {

    minify = minify || false

    // cssProcessor        = cssProcessor || jsProcessor
    // cssProcessorOptions = cssProcessorOptions || jsProcOptions

    let _self = this

    _.each(this.paths, (path) => {
      let answer = undefined,
          _answer

      if (_answer = _self.addToTasks.apply(_self, [path.dest, /\.css$/, () => {
          return [cssProcessor, cssProcessorOptions]
        }, [path]])) {
        answer = _answer
      }
      if (_answer = _self.addToTasks.apply(_self, [path.dest, /\.js$/, () => {
          return !minify ? [babel, _self.babelOptions] : [uglify, jsProcOptions]
        }, [path]])) {
        answer = _answer
      }

      let filename = pathObj.basename(path.dest)

      if (minify) {
        let parts = filename.split('.')

        parts[parts.length - 1] = (_self.minifySuffix || 'min') + '.' + parts[parts.length - 1]

        filename = parts.join('.')
      }

      gulp.src(minify ? path.dest : path.src)
        .pipe(sourcemaps.init())
        .pipe(plumber())
        .pipe(rename({
          suffix: minify ? _self.minifySuffix || 'min' : ''
        }))
        .pipe(answer ? answer[0](answer[1]).on('error', console.log) : (cb) => {return cb;})
        .pipe(livereload())
        .pipe(concat(filename))
        .pipe(gulp.dest(pathObj.dirname(path.dest)))
        .pipe(sourcemaps.write('.').on('error', console.log))
    })
  }

  rJS () {
    rJS(this.rJSOptions)
      .pipe(gulp.dest(pathObj.join(__dirname, '../tests/data/concat/js/amd/out')))
  }

  /**
   * Run watch files changed
   */
  buildWatch (gulp) {
    let files = []
    this.paths.forEach((arr) => {

      for (let i in arr.src) {
        if (!arr.src.hasOwnProperty(i)) {
          continue
        }

        files.push(arr.src[i])
      }
    })

    gulp.watch(files, ['concat'])
  }

  /**
   * Watch changed source files for minified
   */
  minifyWatch () {
    let files = []

    this.paths.forEach((arr) => {
      files.push(arr.dest)
    })

    gulp.watch(files, ['concat-minify'])
  }
}

module.exports = Concat