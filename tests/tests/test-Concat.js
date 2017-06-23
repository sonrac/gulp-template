/**
 * @author Donii Sergii <doniysa@gmail.com>
 */

const _        = require('lodash'),
      chai     = require('chai'),
      expect   = chai.expect,
      pathObj  = require('path'),
      concat   = require("./../../helpers/Concat"),
      helper   = require("./../helper"),
      baseTest = (config, callback, build, minify) => {
          let _concat = new concat(config.config, config.liveReloadOptions, config.defPaths);

          helper.dropFiles([
              __dirname + '/../data/concat/js/simple/out/out.js',
              __dirname + '/../data/concat/js/simple/out/out.min.js',
              __dirname + '/../data/concat/js/simple/out/out.js.map',
              __dirname + '/../data/concat/js/simple/out/out.min.js.map',
              __dirname + '/../data/concat/css/out/out.css',
              __dirname + '/../data/concat/css/out/out.min.css',
              __dirname + '/../data/concat/css/out/out.css.map',
              __dirname + '/../data/concat/css/out/out.min.css.map',
          ]);

          config.defPaths = config.defPaths || {};

          build = build || false;

          if (!build) {
              expect(_concat.paths).is.a('array');
              expect(_concat.paths.length).is.equal(1);
              expect(_concat.paths[0].dest).is.equal((((config.defPaths.outDir || '') + '/' + config.min).replace(/\/\//g, '/')).replace(/\/\//g, '/'));
              expect(_concat.paths[0].src).is.a('array');
              expect(_concat.paths[0].src[0]).is.equal((((config.defPaths.distDir || '') + '/').replace(/\/\//g, '/') + config.config.paths[config.min][0]).replace(/\/\//g, '/'));
              expect(_concat.paths[0].src.length).is.equal(1);
              callback();
          } else {
              minify = minify || false;
              _concat.build(minify);
              setTimeout(() => {
                  expect(_concat.paths[0].dest).is.a.file();
                  _concat.minify();
                  setTimeout(() => {
                      let file     = _concat.paths[0].dest,
                          ext      = pathObj.extname(file),
                          filename = pathObj.basename(file).replace(ext, '');
                      expect(pathObj.dirname(file) + '/' + filename + ext).is.a.file();
                      callback();
                  }, 500)
              }, 1000)

          }

      };

chai.use(require('chai-fs'));

describe('Test files concatenate', () => {
    it('Test constructor concatenate with fully path', (done) => {
        let config          = {};
        config.min          = __dirname + '/test.css';
        config.config       = {};
        config.config.paths = {};

        config.config.paths[config.min] = [
            __dirname + '/../data/css-tests/less/src/test.less',
            __dirname + '/../data/css-tests/less/src/test.less',
        ];

        baseTest(config, done);
    });
    it('Test constructor concatenate build with relative path', (done) => {
        let config          = {
            defPaths: {
                distDir: __dirname + '/../data/css-tests',
                outDir : __dirname + '/../data/'
            }
        };
        config.min          = '/test.css';
        config.config       = {};
        config.config.paths = {};

        config.config.paths[config.min] = [
            'less/src/test.less',
            'less/src/test.less',
        ];

        baseTest(config, done);
    });
    it('Test concatenate & build js with absolute path', (done) => {
        let config          = {};
        config.min          = __dirname + '/../data/concat/js/simple/out/out.js';
        config.config       = {};
        config.config.paths = {};

        config.config.paths[config.min] = [
            __dirname + '/../data/concat/js/simple/src/main.js',
            __dirname + '/../data/concat/js/simple/src/second.js',
        ];

        baseTest(config, done, true);
    });
    it('Test concatenate & build js with relative path', (done) => {
        let config          = {
            defPaths: {
                distDir: __dirname + '/../data/concat',
                outDir : __dirname + '/../data/concat'
            }
        };
        config.min          = 'js/simple/out/out.js';
        config.config       = {};
        config.config.paths = {};

        config.config.paths[config.min] = [
            'js/simple/src/main.js',
            'js/simple/src/second.js',
        ];

        baseTest(config, done, true);
    });
    it('Test concatenate & build & minify js with absolute path', (done) => {
        let config          = {};
        config.min          = __dirname + '/../data/concat/js/simple/out/out.js';
        config.config       = {};
        config.config.paths = {};

        config.config.paths[config.min] = [
            __dirname + '/../data/concat/js/simple/src/main.js',
            __dirname + '/../data/concat/js/simple/src/second.js',
        ];

        baseTest(config, done, true, true);
    });

    it('Test concatenate & minify css with relative path', (done) => {
        let config          = {
            defPaths: {
                distDir: __dirname + '/../data/concat/css/src',
                outDir : __dirname + '/../data/concat/css/out'
            }
        };
        config.min          = 'out.css';
        config.config       = {};
        config.config.paths = {};

        config.config.paths[config.min] = [
            'main.css',
            'second.css',
        ];

        baseTest(config, done, true, true);
    });

    it('Test concatenate & minify css with absolute path', (done) => {
        let config          = {};
        config.min          = __dirname + '/../data/concat/css/out/out.css';
        config.config       = {};
        config.config.paths = {};

        config.config.paths[config.min] = [
            __dirname + '/../data/concat/css/src/main.css',
            __dirname + '/../data/concat/css/src/second.css',
        ];

        baseTest(config, done, true, true);
    });

});