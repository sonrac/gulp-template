/**
 * @author Donii Sergii <doniysa@gmail.com>
 */

const chai   = require('chai'),
      expect = chai.expect,
      _      = require('lodash'),
      fs     = require('fs'),
      helper = require('./../helper'),
      JS     = require('./../../helpers/JS')

chai.use(require('chai-fs'))

let build = new helper.buildTest({
  extFile      : 'js',
  minifySuffix : '.min',
  timeout      : [1800, 800],
  buildObject  : JS,
  optionName   : 'js',
  task         : 'build-js',
  isEqualString: false,
  configName   : 'js',
  taskMinify   : 'minify-js',
  buildCallback: (obj, series, processorName, path, ext, optional, _config, pattern) => {
    series.config[obj.configName].paths = optional ? [
      {
        src : '/src/*.' + ext,
        dest: 'out'
      }
    ] : [{
      src : __dirname + '/../data/' + obj.dir + '/' + path + '/src/*.' + ext,
      dest: __dirname + '/../data/' + obj.dir + '/' + path + '/out'
    }]

    _config = _config || {}

    series.config[obj.configName] = _.extend(series.config[obj.configName], {
      processor       : _config.processor || 'gulp-babel',
      babelOptions    : _config.babelOptions,
      sourceExt       : ext,
      outputExt       : 'js',
      processorOptions: _config.processorOptions
    })

    return series.config
  },
  dir          : 'js-tests',
  dataString   : 'use strict',
  dataStringMin: 'use strict'
})

describe('Test JS constructor', function () {
  this.timeout(15000)
  it('Test simple options', (done) => {

    let js = new JS({
      paths    : ['1'],
      sourceExt: 'js',
    }, {}, {
      outDir : __dirname,
      distDir: __dirname
    })

    expect(js.paths.length).is.equal(1)
    expect(js.paths[0]).is.equal('1')
    expect(js.getBuildPaths()).is.a('Array')
    expect(_.size(js.getBuildPaths())).is.equal(1)

    done()
  })

  build.build('gulp-babel', 'js', 'js', false)
  build.build('gulp-babel', 'js', 'js', true)

  build.build('gulp-typescript-babel', 'typescript', 'ts', false, {
    processor       : 'gulp-typescript-babel',
    processorOptions: {
      incremental: true,
      configFile : __dirname + '/../data/js-tests/typescript/src/tsconfig.json'
    },
    babelOptions    : {presets: ['es2015']}
  })
  build.build('gulp-typescript-babel', 'typescript', 'ts', true, {
    processor: 'gulp-typescript-babel'
  }, 'var Car = function')
  build.build('gulp-coffee', 'coffeescript', 'coffee', false, {
    processor       : 'gulp-coffee',
    processorOptions: {bare: true},
  }, 'var cubes, list, math, num, number, opposite, race, square,', 'var cubes,list,math,num,number,opposite,race,square')
  build.build('gulp-coffee', 'coffeescript', 'coffee', true, {
    processor       : 'gulp-coffee',
    processorOptions: {bare: true},
  }, 'var cubes, list, math, num, number, opposite, race, square', 'var cubes,list,math,num,number,opposite,race,square')
})