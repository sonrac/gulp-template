/**
 * @author Donii Sergii <doniysa@gmail.com>
 */

const _helper = require('./../../configRestore')
_helper.checkConfig()

const chai   = require('chai'),
      fs     = require('fs'),
      expect = chai.expect,
      helper = require('./../../helper'),
      series = require('./../../../gulpfile')

chai.use(require('chai-fs'))

describe('Test JS Build from test project', () => {
  helper.dropFiles([
    __dirname + '/../../test-project/build/js/tabular.js',
    __dirname + '/../../test-project/build/js/tabular.min.js',
  ])

  series.series.tasks['build-js']()

  _helper.checkConfig()

  it('Test Build JS', (done) => {
    setTimeout(() => {
      expect(__dirname + '/../../test-project/build/js/tabular.js').is.a.file()
      done()
    }, 300)
  })

  it('Test JS minify', (done) => {
    setTimeout(() => {
      series.series.tasks['minify-js']()
      setTimeout(() => {
        expect(__dirname + '/../../test-project/build/js/tabular.min.js').is.a.file()
        _helper.restoreConfig()
        done()
      }, 500)
    }, 400)
  })
})