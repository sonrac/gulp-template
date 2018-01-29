/**
 * @author Donii Sergii <doniysa@gmail.com>
 */

const chai      = require('chai'),
      expect    = chai.expect,
      fs        = require('fs'),
      _         = require('lodash'),
      PathBuild = require('./../../helpers/PathBuild')

describe('Path build test', () => {
  let build = new PathBuild([
    'test',
    {
      'src': '1'
    },
    {
      'src' : '2',
      'dest': '3'
    }
  ], 'default')
  it('Test prepare paths', (done) => {

    let path = build.process()
    expect(path).is.a('Array')

    _.each(path, (value, index) => {
      expect(value).is.a('Object')
      expect(value.dest).is.a('string')
      expect(value.src).is.a('string')
    })

    done()
  })

  it('Test full path builder & check', () => {
    let paths = [
      'tests/data'
    ]

    let _prepare = new PathBuild(paths, 'tests/data/1')

    paths = _prepare.processFullPath()

    expect(paths).is.a('Array')
    expect(paths[0].src).to.have.string('tests/data')
    expect(paths[0].dest).to.have.string('tests/data/1')
  })

  it('Test full path builder & check does not exists src', () => {
    let paths = [
      'test/data'
    ]

    let _prepare = new PathBuild(paths, 'tests/data/1')

    paths = _prepare.processFullPath()

    expect(paths).is.a('Array')
    expect(paths.length).is.equal(0)
  })

  it('Test full path builder with check destination path which not exists', () => {
    let paths = [
      'tests/data'
    ]

    let _prepare = new PathBuild(paths, 'tests/data/1')

    paths = _prepare.processFullPath(true)

    expect(paths).is.a('Array')
    expect(paths.length).is.equal(0)
  })

  it('Test full path builder with check destination path which exists', () => {
    let paths = [
      'tests/data'
    ]

    let _prepare = new PathBuild(paths, 'tests/data/destination')

    paths = _prepare.processFullPath(true)

    expect(paths[0].src).to.have.string('tests/data')
    expect(paths[0].dest).to.have.string('tests/data/destination')
  })

  it('Test full path builder with check destination path which exists as path array', (done) => {
    let paths = [
      ['tests/data'],
    ]

    let _prepare = new PathBuild(paths, 'tests/data/destination')

    paths = _prepare.processFullPath(true, true)

    expect(paths[0].src).is.a('array')
    expect(paths[0].src.length).is.equal(1)
    expect(paths[0].src[0]).to.have.string('tests/data')
    expect(paths[0].dest).to.have.string('tests/data/destination')
    done()
  })
})