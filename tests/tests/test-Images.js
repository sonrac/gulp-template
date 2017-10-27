/**
 * @author Donii Sergii <doniysa@gmail.com>
 */

const chai   = require('chai'),
      expect = chai.expect,
      fs     = require('fs'),
      _      = require('lodash'),
      helper = require('./../helper'),
      series = require('./../../gulpfile'),
      add    = ''

chai.use(require('chai-fs'))

describe('Test image optimize', () => {

  helper.dropFiles([
    pathObj.join(__dirname, '../data/images/out/1', add + '.jpg'),
    pathObj.join(__dirname, '../data/images/out/2', add + '.gif'),
    pathObj.join(__dirname, '../data/images/out/3', add + '.svg'),
    pathObj.join(__dirname, '../data/images/out/4', add + '.png'),
    pathObj.join(__dirname, '../data/images/out/5', add + '.jpg'),
    pathObj.join(__dirname, '../data/images/now/1', add + '.jpg'),
    pathObj.join(__dirname, '../data/images/now/2', add + '.gif'),
    pathObj.join(__dirname, '../data/images/now/3', add + '.svg'),
    pathObj.join(__dirname, '../data/images/now/4', add + '.png'),
    pathObj.join(__dirname, '../data/images/now/5', add + '.jpg'),
  ])

  let image = (dist, out, extinfo, additional, file) => {
        file     = file || ''
        let base = file ? out + '/../src/' + file : dist
        it('Test optimize ' + extinfo + (additional || ''), (done) => {
          let size = fs.statSync(base).size, sizeAfter

          series.config.images = {
            paths: [{
              src : dist,
              dest: out
            }]
          }

          setTimeout(() => {
            series.series.tasks['imagemin']()

            setTimeout(() => {
              sizeAfter = fs.statSync(out + file).size

              expect(fs.existsSync(out + file)).is.equal(true)

              expect(size).is.greaterThan(sizeAfter)
              done()
            }, 700)
          }, 500)
        })
      },
      base  = pathObj.join(__dirname, '../data/images/src'),
      out   = pathObj.join(__dirname, '../data/images/out'),
      now   = pathObj.join(__dirname, '../data/images/now')
  image(base + '/1.jpg', out, 'jpg')
  image(base + '/2.gif', out, 'gif')
  image(base + '/3.svg', out, 'svg')
  image(base + '/4.png', out, 'png')
  image(base + '/5.jpg', out, 'jpg')
  image(out + '/1' + add + '.jpg', now, 'jpg', ' Second ')
  image(out + '/2' + add + '.gif', now, 'gif', ' Second ')
  image(out + '/3' + add + '.svg', now, 'svg', ' Second ')
  image(out + '/4' + add + '.png', now, 'png', ' Second ')
  image(out + '/5' + add + '.jpg', now, 'jpg', ' Second ')
  image(base + '/*', out, 'images', '', '/1.jpg')
}).timeout(5000)