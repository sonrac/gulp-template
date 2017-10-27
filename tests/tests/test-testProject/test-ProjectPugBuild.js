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

describe('Test JS Build from test project', function () {
  this.timeout(10000)
  helper.dropFiles([
    pathObj.join(__dirname, '../../test-project/build/index.html'),
    pathObj.join(__dirname, '../../test-project/build/index.min.html'),
  ])

  series.series.tasks['templates']()

  _helper.checkConfig()

  it('Test Build Pug', (done) => {
    setTimeout(() => {
      expect(pathObj.join(__dirname, '../../test-project/build/index.html')).is.a.file()
      done()
    }, 1200)
  })

  it('Test HTML minify', (done) => {
    setTimeout(() => {
      series.config.templates.enableMinify = true
      series.series.tasks['minify-html']()
      setTimeout(() => {
        expect(pathObj.join(__dirname, '../../test-project/build/index.min.html')).is.a.file()
        _helper.restoreConfig()
        done()
      }, 1000)
    }, 1200)
  })
})