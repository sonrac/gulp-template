/**
 * @author Donii Sergii <doniysa@gmail.com>
 */

/**
 * @ignore _
 * @ignore gulp
 * @ignore watch
 * @ignore Rsync
 */

const _         = require('lodash'),
      gulp      = require('gulp'),
      watch     = gulp.watch,
      PathBuild = require('./PathBuild'),
      Rsync     = require('rsync')

/**
 * @class {CopyFiles}
 *
 * Copy files helper. Usages in copy & moving tasks
 *
 * @property {Array|Object} paths Paths config
 *
 * @author Donii Sergii<doniysa@gmail.com>
 */
class CopyFiles {
  /**
   * CopyFiles constructor
   *
   * @param {Object} config Config
   * @param {String} defaultOut Default destination dir
   *
   * @author Donii Sergii<doniysa@gmail.com>
   */
  constructor (config, defaultOut) {
    this.paths = []

    this.rsyncOptions = config.rsyncOptions
    this.tasks        = config.tasks || 'copy'

    if (!_.isArray(this.tasks)) {
      this.tasks = [this.tasks]
    }

    if (!_.isArray(config.paths)) {
      config.paths = [paths]
    }

    let _self = this

    _.each(config.paths, function (path, index) {
      let curPath = _.isString(index) ? index : defaultOut,
          _paths  = _.isArray(path) ? path : (_.isString(path) || (_.isObject(path) ? [path] : undefined))

      if (!_paths) {
        return
      }

      _paths.forEach(function (path, index) {
        let nextPath = {}

        if (!curPath && !path.src) {
          return
        }

        nextPath.dest = _.isObject(path) ? path.dest : path
        nextPath.src  = curPath || path.src

        _self.paths.push(nextPath)
      })
    })
  }

  /**
   * Get options for rsync
   *
   * @returns {Object}
   *
   * @author Donii Sergii<doniysa@gmail.com>
   */
  getRsyncOptions (dest, src) {
    let _rsync = new Rsync()

    if (_.isFunction(this.rsyncOptions)) {
      return this.rsyncOptions.call(this, [_rsync, dest, src])
    }

    return _rsync
  }

  /**
   * Build rsync command
   *
   * @param {String} dest Destination folder
   * @param {String} src Source folder
   * @returns {Rsync}
   *
   * @author Donii Sergii<doniysa@gmail.com>
   */
  rsyncBuild (dest, src) {
    return this.getRsyncOptions()
      .flags('r')
      .exclude('.*')
      .source(src)
      .destination(dest)
  }

  /**
   * Sync directories
   *
   * @param {Boolean} moved If true - delete source file after sync
   * @param {Object} rOptions rsync options
   * @param {String} countTry Current try sync count
   *
   * @author Donii Sergii<doniysa@gmail.com>
   */
  sync (moved, rOptions, countTry) {
    countTry = countTry || 0

    if (countTry > 200) {
      return
    }

    let sync = this.rsyncBuild(rOptions.dest, rOptions.src)

    if (moved) {
      sync.set('remove-source-files')
    }

    sync.execute((error, stdout, stderr) => {
      if (error)
        console.log('Copy or move error: ' + error)
    })
  }

  /**
   * Run rsync
   * @param {Boolean} moved If true - delete source file after sync
   *
   * @author Donii Sergii<doniysa@gmail.com>
   */
  process (moved) {
    moved     = typeof moved !== 'undefined' ? moved : false
    let _self = this

    _.each(this.paths, (path) => {
      ((moved, path) => {
        _self.sync(moved, path)
      })(moved, path)

    })
  }

  /**
   * Watch source files for copy
   *
   * @author Donii Sergii<doniysa@gmail.com>
   */
  buildWatch (gulp) {
    let sources = []
    this.paths.forEach((path) => {
      sources.push(path.src)
      sources.push((path.src + '/**/**/**/**/**/**/**/**/**/**/**/**/**/**/**/**/**/**/*').replace(/\/\//g, '/'))
    })

    gulp.watch(sources, this.tasks)
  }
}

module.exports = CopyFiles