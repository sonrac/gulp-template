/**
 * @author Donii Sergii <doniysa@gmail.com>
 */

const chai   = require('chai'),
      expect = chai.expect,
      fs     = require('fs'),
      series = require('./../../gulpfile'),
      helper = require('./../helper'),
      copy   = require('./../../helpers/CopyFiles')

chai.use(require('chai-fs'))
const oldConfig = series.config

let prepareFiles = () => {
  let files = [],
      dests = []

  for (let i = 1; i <= 4; i++) {
    let filename = __dirname + '/../data/src/' + i.toString() + '.txt',
        destName = __dirname + '/../data/destination/' + i.toString() + '.txt'
    files.push(filename)
    dests.push(destName)
  }

  helper.dropFiles(dests)
  helper.createEmptyFiles(files)

  return files
}

describe('CopyFiles class tests', () => {
  configObj = {
    copyFiles: {
      paths: [
        {
          dest: __dirname + '/../data/destination',
          src : __dirname + '/../data/src/*'
        }
      ]
    },
    moveFiles: {
      paths: [
        {
          dest: __dirname + '/../data/destination',
          src : __dirname + '/../data/src/*'
        }
      ]
    }
  }
  let files     = prepareFiles()

  it('Files Creation', (done) => {
    files = prepareFiles()
    series.changeConfig(configObj)
    series.series.tasks['copy']()
    setTimeout(() => {
      files.forEach((path) => {
        expect(path.replace('/src', '/destination')).is.a.file()
      })
      series.changeConfig(oldConfig)

      done()
    }, 100)
  })

  it('Moving Files', (done) => {
    series.changeConfig(configObj)
    series.series.tasks['move']()
    setTimeout(() => {
      done()
      files.forEach((path) => {
        expect(path).not.is.a.file()
        expect(path.replace('/src', '/destination')).is.a.file()
      })
      series.changeConfig(oldConfig)
      done()
    }, 100)
  })
})
