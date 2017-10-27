/**
 * @author Donii Sergii <doniysa@gmail.com>
 */

const fs     = require('fs'),
      chai   = require('chai'),
      series = require('./../gulpfile'),
      expect = chai.expect,
      _      = require('lodash')

chai.use(require('chai-fs'))

let objHelper = {
  dropFiles       : (list) => {
    _.each(list, function (filename) {
      try {
        fs.statSync(filename)

        fs.unlinkSync(filename)
      } catch (e) {
      }
    })
  },
  createEmptyFiles: (list) => {
    _.each(list, function (filename) {
      fs.openSync(filename, 'w')
    })
  },
  buildTest       : class Build {
    constructor (options) {
      let _self = this
      _.each(options, (value, option) => {
        _self[option] = value
      })

      this.timeout = this.timeout || [500, 500]
      this.helper  = objHelper
    }

    build (processorName, path, ext, optional, _config, pattern, patternMin) {
      optional  = optional || false
      let _self = this

      it('Test ' + processorName + ' build' + (optional ? ' with relative path' : ''), (done) => {
        objHelper.dropFiles([
          __dirname + '/data/' + _self.dir + '/' + path + '/out/test.' + _self.extFile,
          __dirname + '/data/' + _self.dir + '/' + path + '/out/test.' + _self.extFile + '.map',
          __dirname + '/data/' + _self.dir + '/' + path + '/out/test' + _self.minifySuffix + '.' + this.extFile,
          __dirname + '/data/' + _self.dir + '/' + path + '/out/test' + _self.minifySuffix + '.' + this.extFile + '.map'
        ])

        series.config                             = _.extend(series.config || {}, _self.config || {})
        series.config[_self.configName]           = {processor: processorName}
        series.config.outDir                      = optional ? __dirname + '/data/' + this.dir + '/' + path : ''
        series.config.distDir                     = optional ? __dirname + '/data/' + this.dir + '/' + path + '/out' : ''
        series.config[_self.configName].sourceExt = ext
        series.config[_self.configName].outputExt = _self.outputExt

        series.config = _self.buildCallback.apply(_self, [_self, series, processorName, path, ext, optional, _config, pattern, patternMin])

        series.config[_self.configName].sourceExt = ext
        series.config[_self.configName].outputExt = _self.outputExt

        let filename = __dirname + '/data/' + _self.dir + '/' + path + '/out/test.' + _self.extFile

        series.series.tasks[_self.task]()
        setTimeout(() => {
          series.series.tasks[_self.taskMinify]()
          expect(filename).is.a.file()

          let data = fs.readFileSync(filename, 'utf8')

          if (_self.isEqualString) {
            expect(data).is.equal(_self.dataString)
          } else {
            expect(data.match(pattern || _self.dataString)).is.a('array')
          }

          setTimeout(() => {
            let filename = __dirname + '/data/' + _self.dir + '/' + path + '/out/test' + _self.minifySuffix + '.' + _self.extFile,
                data     = fs.readFileSync(filename, 'utf8')

            expect(filename).is.a.file()

            if (_self.isEqualString) {
              expect(data).is.equal((patternMin || _self.dataStringMin).toString().split('\n'))
            } else {
              expect(data.match((patternMin || _self.dataStringMin).toString().split('\n').join(''))).is.a('array')
            }
            done()
          }, _self.timeout[1])
        }, _self.timeout[0])
      })
    }
  }
}

module.exports = objHelper