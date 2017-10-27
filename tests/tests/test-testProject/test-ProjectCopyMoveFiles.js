/**
 * @author Donii Sergii <doniysa@gmail.com>
 */

const _helper = require('./../../configRestore'),
      chai    = require('chai'),
      sys     = require('child_process'),
      expect  = chai.expect,
      series  = require('./../../../gulpfile')

chai.use(require('chai-fs'))

describe('Test Copy & move files', function () {
  this.timeout(10000)

  _helper.checkConfig()
  let path = __dirname + '/../../test-project/build/plugins'
  sys.execSync('rm -rf ' + path)

  series.series.tasks['copy']()

  it('Test copy files in project', (done) => {
    setTimeout(() => {
      expect(__dirname + '/../../test-project/build/plugins/bootstrap/css/bootstrap.min.css').is.a.file()
      expect(__dirname + '/../../test-project/build/plugins/yii/yii.js').is.a.file()

      done()
      series.series.tasks['move']()

      it('Test move files in project', (done) => {
        setTimeout(() => {
          expect(__dirname + '/../../test-project/build/plugins/bootstrap/yii/yii.js').is.not.file()
          expect(__dirname + '/../../test-project/build/yii.js').is.not.file()
          done()
        }, 1000)
      })
    }, 1000)
  })

  it('Test move files in project', (done) => {
    setTimeout(() => {
      series.series.tasks['move']()
      setTimeout(() => {
        expect(__dirname + '/../../test-project/build/plugins/yii.js').is.a.file()
        done()
      }, 1000)
    }, 1000)
  })
})