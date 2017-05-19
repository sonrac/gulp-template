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

describe('Test JS Build from test project', () => {
    series.series.tasks['templates']();

    helper.dropFiles([
        __dirname + '/../../test-project/build/index.html',
        __dirname + '/../../test-project/build/index.min.html',
    ]);

    it('Test Build Pug', (done) => {
        setTimeout(() => {
            expect(__dirname + '/../../test-project/build/index.html').is.a.file();
            done();
        }, 300);
    });

    it('Test HTML minify', (done) => {
        setTimeout(() => {
            series.config.templates.enableMinigy = true;
            series.series.tasks['minify-html']();
            setTimeout(() => {
                expect(__dirname + '/../../test-project/build/index.min.html').is.a.file();
                _helper.restoreConfig();
                done();
            }, 500);
        }, 400);
    });
});