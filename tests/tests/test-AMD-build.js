/**
 * @author Donii Sergii <doniysa@gmail.com>
 */

const chai   = require('chai'),
      _      = require('lodash'),
      expect = chai.expect,
      concat = require('./../../helpers/Concat')

chai.use(require('chai-fs'))

/**
 *
 */
describe('AMD test build', () => {
  it('Test amd build', (done) => {
    let config = {
      configFile: '../bootstrap',
      baseUrl   : pathObj.join(__dirname, '../data/concat/js/amd/src'),
      outFile   : '../out/build.js'
    }

    let c = new concat(config)

    c.rJS()

    setTimeout(() => {
      expect(pathObj.join(__dirname, '../data/concat/js/amd/out/build.js')).is.a.file()
      done()
    }, 500)
  })
})