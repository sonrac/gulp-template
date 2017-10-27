/**
 * @author Donii Sergii <doniysa@gmail.com>
 */
/**
 * @ignore _
 * @ignore gulp
 * @ignore fs
 */

const _       = require('lodash'),
      pathObj = require('path'),
      fs      = require('fs')

/**
 * @class {PathBuild}
 * Prepare paths helper
 *
 * @property {Object|Array} pathConfig Path config
 * @property {Object} originalConfig Original config
 * @property {String} defaultOutPath Default out dir
 * @property {String} distDir Distributive config default dit
 * @property {String} outDir Output config default dir
 * @property {Boolean} destinationArray If false, set src array or dest as array otherwise
 *
 * @author Donii Sergii<doniysa@gmail.com>
 */
class PathBuild {

  /**
   * PathBuild constructor
   * @param {Object|Array} pathConfig
   * @param {String|undefined} defaultOutFolder
   * @param {{outDir: {String}, distDir: {String}}|undefined} options Default path config option
   * @param {Boolean} arrDestination If false, set src array or dest as array otherwise
   *
   * @author Donii Sergii<doniysa@gmail.com>
   */
  constructor (pathConfig, defaultOutFolder, options, arrDestination) {
    options               = options || {}
    this.originalConfig   = pathConfig
    this._pathConfig      = []
    this.defaultOutFolder = defaultOutFolder
    this.distDir          = options.distDir
    this.outDir           = options.outDir
    this.destinationArray = arrDestination || false

    this.process()
  };

  /**
   * Get path config
   *
   * @returns {Array}
   *
   * @author Donii Sergii<doniysa@gmail.com>
   */
  get pathConfig () {
    return this._pathConfig
  }

  /**
   * Build watch file list
   *
   * @param {Array} paths Path config
   * @param {String} opt Option path name
   *
   * @returns {Array}
   */
  static buildWatchPaths (paths, opt) {
    opt        = opt || 'src'
    let nPaths = []
    _.each(paths, (path) => {
      if (_.isArray(path[opt])) {
        for (let i in path[opt]) {
          if (!path[opt].hasOwnProperty(i)) {
            continue
          }

          nPaths.push(path[opt][i])
        }
      } else {
        nPaths.push(path[opt])
      }
    })

    return nPaths
  }

  /**
   * Format path config
   *
   * @returns {Array}
   *
   * @author Donii Sergii<doniysa@gmail.com>
   */
  process () {
    this._pathConfig = []
    let _self        = this

    _.forEach(this.originalConfig, (value, index) => {

      let path = {}

      if (_.isString(value)) {
        path.src = value
      }

      if (_.isObject(value)) {
        if (value.src) {
          path.src = value.src
        }

        if (value.dest) {
          path.dest = value.dest
        }
      }

      if (_.isArray(value)) {
        if (_self.destinationArray) {
          path.dest = value
        } else {
          path.src = value
        }
      }

      if (_.isUndefined(path.src)) {
        path.src = _self.distDir || (_self.outDir || _self.defaultOutFolder)
      }
      if (_.isUndefined(path.dest)) {
        path.dest = _self.outDir || _self.defaultOutFolder
      }

      _self._pathConfig.push(path)
    })

    return this._pathConfig
  }

  /**
   * Clear path
   *
   * @param {String} path Path for clear
   *
   * @returns {Object}
   *
   * @author Donii Sergii<doniysa@gmail.com>
   */
  clearPath (path) {
    let pathParts  = path.replace(/\/\//g, '/').split('/'),
        retPath    = '',
        additional = '',
        end        = false

    for (let i in pathParts) {
      if (!pathParts.hasOwnProperty(i)) {
        continue
      }

      if (pathParts[i].indexOf('*') === 0) {
        end = true
      }

      if (!end) {
        retPath += '/' + pathParts[i]
      } else {
        additional += '/' + pathParts[i]
      }
    }

    return [retPath.replace(/\/\//g, '/'), path, additional]
  }

  /**
   * Check directory exists
   *
   * @param {String} path
   *
   * @returns {boolean}
   *
   * @author Donii Sergii<doniysa@gmail.com>
   */
  checkDirectoryExists (path) {
    try {
      fs.statSync(path)
    } catch (e) {
      return false
    }

    return true
  }

  /**
   * Get real path if exists
   *
   * @param {String} path Checking path
   * @param {Boolean} checkDestination Check path exists flag
   * @param {Object} context Context which called checking
   * @param {Boolean} destination Destination folder flag for correctly check exists folders
   * @returns {*}
   *
   * @author Donii Sergii<doniysa@gmail.com>
   */
  getRealPath (path, checkDestination, context, destination) {
    if (_.isArray(path)) {
      let __self   = this,
          newPaths = []
      path.forEach((_path, index) => {
        let buildPath = __self.getRealPath(_path, checkDestination, context, destination)

        if (!_.isEmpty(buildPath)) {
          newPaths.push(buildPath)
        }
      })

      return _.uniq(newPaths)
    }

    checkDestination = _.isUndefined(checkDestination) ? false : checkDestination

    if (checkDestination === false) {
      return path
    }

    path = this.clearPath(path)

    if (_.isEmpty(path) || !path.length) {
      path = destination ? context.outDir : context.distDir
    }

    let allPaths = []

    if (this.destinationArray) {

      let base      = (destination ? this.outDir : this.distDir) || '',
          buildPath = (_path, level) => {
            let newPath    = _path,
                additional = []

            for (let i = 0; i < level; i++) {
              let p = pathObj.dirname(newPath)
              if (_.isEmpty(newPath)) {
                break
              }

              additional.push(pathObj.basename(newPath))
              newPath = p
            }

            return [newPath, additional.reverse().join('/')]
          }

      let dirnames = []

      for (let i = 0; i < 3; i++) {
        dirnames[i]     = buildPath(path[0], i)
        dirnames[i + 3] = [base + dirnames[i][0], dirnames[i][1]]

        dirnames[i + 6] = buildPath(path[1], i + 3)
        dirnames[i + 9] = [base + dirnames[i + 6][0], dirnames[i + 6][1]]

      }

      dirnames.forEach((value) => {
        if (!_.isEmpty(value)) {
          allPaths.push(value)
        }
      })
    }

    let _path = (__dirname + '/../' + path[0]).replace(/\/\//g, '/');
    (destination ? [
      ((context.outDir || '') + '/' + path[0]).replace(/\/\//g, '/'),
      ((context.outDir || '') + '/' + path[1]).replace(/\/\//g, '/'),
    ] : [
      ((context.distDir || '') + '/' + path[0]).replace(/\/\//g, '/'),
      ((context.distDir || '') + '/' + path[1]).replace(/\/\//g, '/'),
    ]).forEach((value) => {
      allPaths.push(value)
    })

    if (destination) {
      [
        ((context.outDir || '') + '/' + path[0]).replace(/\/\//g, '/'),
        ((context.outDir || '') + '/' + path[1]).replace(/\/\//g, '/'),
        context.outDir,
        ((context.distDir || '') + '/' + path[0]).replace(/\/\//g, '/'),
        ((context.distDir || '') + '/' + path[1]).replace(/\/\//g, '/'),
      ].forEach((value) => {
        allPaths.push(value)
      })
    }

    let additional = path[2],
        firstAdd   = path[1];

    [
      _path,
      path[0],
      (__dirname + '/' + path[0]).replace(/\/\//g, '/'),
      path[1],
      context.outDir
    ].forEach((value) => {
      allPaths.push(value)
    })

    allPaths = _.uniq(allPaths);

    (destination ? [
      ((context.distDir || '') + '/' + path[0]).replace(/\/\//g, '/'),
      ((context.distDir || '') + '/' + path[1]).replace(/\/\//g, '/'),
    ] : [
      ((context.outDir || '') + '/' + path[0]).replace(/\/\//g, '/'),
      ((context.outDir || '') + '/' + path[1]).replace(/\/\//g, '/'),
    ]).forEach((value) => {
      allPaths.push(value)
    })

    path = ''

    let keys = _.keys(allPaths)

    for (let i = 0; i <= keys.length; i++) {
      let ind = keys[i]
      if (_.isUndefined(allPaths[ind])) {
        continue
      }

      let addToPath = ''
      if (_.isArray(allPaths[ind])) {
        path      = allPaths[ind][0].replace(/\/\//g, '/').replace(/\/$/, '')
        addToPath = allPaths[ind][1]
      } else {
        path      = allPaths[ind].replace(/\/\//g, '/').replace(/\/$/, '')
        addToPath = additional
      }

      if (this.checkDirectoryExists(path)) {

        if (path === context.outDir && !this.destinationArray) {
          if (path === firstAdd) {
            return path
          }

          return (path + '/' + firstAdd).replace(/\/\//g, '/').replace(/\/$/, '')
        }

        return (path + '/' + addToPath).replace(/\/\//g, '/').replace(/\/$/, '')
      }
    }

    return ''
  }

  /**
   * Generate full path and check existing
   *
   * @param {Boolean} checkDestination Check destination
   * @param {Boolean} checkSource Check source
   * @returns {Array}
   *
   * @author Donii Sergii<doniysa@gmail.com>
   */
  processFullPath (checkDestination, checkSource) {
    checkSource   = _.isUndefined(checkSource) ? true : checkSource
    let realPaths = [],
        path, dest,
        _self     = this

    _.each(this._pathConfig, (value, index) => {
      if (_.isUndefined(value.dest)) {
        throw 'Destination is empty. Check paths option'
      }

      if ((path = _self.getRealPath(value.src, checkSource, _self)) && (dest = _self.getRealPath(value.dest, checkDestination, _self, true))) {
        realPaths.push({
          src : path,
          dest: dest || value.dest
        })
      }
    })

    return realPaths
  }
}

module.exports = PathBuild