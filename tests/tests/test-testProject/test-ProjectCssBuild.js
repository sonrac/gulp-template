/**
 * @author Donii Sergii <doniysa@gmail.com>
 */

const _helper = require('./../../configRestore');
_helper.checkConfig();

const chai   = require('chai'),
      fs     = require('fs'),
      expect = chai.expect,
      helper = require('./../../helper'),
      series = require('./../../../gulpfile');

chai.use(require('chai-fs'));

describe('Test CSS Build from test project', () => {
    series.series.tasks['build-css']();

    helper.dropFiles([
        __dirname + '/../../test-project/build/cs/tabular.css',
        __dirname + '/../../test-project/build/cs/tabular.min.css',
    ]);

    it('Test Build CSS', (done) => {
        setTimeout(() => {
            expect(__dirname + '/../../test-project/build/css/tabular.css').is.a.file();
            done();
        }, 300);
    });

    it('Test CSS minify', (done) => {
        setTimeout(() => {
            series.series.tasks['minify-css']();
            setTimeout(() => {
                expect(__dirname + '/../../test-project/build/css/tabular.min.css').is.a.file();
                _helper.restoreConfig();
                done();
            }, 500);
        }, 400);
    });
});