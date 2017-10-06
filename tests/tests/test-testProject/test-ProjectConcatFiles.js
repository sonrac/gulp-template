/**
 * @author Donii Sergii <doniysa@gmail.com>
 */

const _helper = require('./../../configRestore'),
    chai = require('chai'),
    sys = require('child_process'),
    expect = chai.expect,
    series = require('./../../../gulpfile');

chai.use(require('chai-fs'));

describe('Test concatenate files', () => {

    _helper.checkConfig();
    let path = __dirname + '/../../test-project/build/js-concat.js',
        minPath = __dirname + '/../../test-project/build/js-concat.min.js';
    sys.execSync('rm -rf ' + path);
    sys.execSync('rm -rf ' + path + '.map');
    sys.execSync('rm -rf ' + minPath);
    sys.execSync('rm -rf ' + minPath + '.map');

    console.log(series.config['concat']);
    process.exit();

    series.series.tasks['concat']();

    it('Test copy files in project', (done) => {
        setTimeout(() => {
            expect(path).is.a.file();

            done();
            _helper.restoreConfig();
        }, 400);
    });

    // it('Test copy files in project', (done) => {
    //     setTimeout(() => {
    //         series.series.tasks['concat-minify']();
    //         setTimeout(() => {
    //             expect(minPath).is.a.file();
    //             done();
    //             _helper.restoreConfig();
    //         }, 900);
    //     }, 400);
    // });
});