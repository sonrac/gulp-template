/**
 * @author Donii Sergii <doniysa@gmail.com>
 */

const _      = require('lodash'),
      chai   = require('chai'),
      expect = chai.expect,
      concat = require("./../../helpers/Concat");

chai.use(require('chai-fs'));

describe('Test files concatenate', () => {
    it('Test constructor path build with fully path', (done) => {
        let min    = __dirname + "/test.css",
            config = {
                paths: {}
            };

        config.paths[min] = [
            __dirname + '/../data/css-tests/less/src/test.less',
            __dirname + '/../data/css-tests/less/src/test.less',
        ];

        let _concat = new concat(config);

        expect(_concat.paths).is.a('array');
        expect(_concat.paths.length).is.equal(1);
        expect(_concat.paths[0].dest).is.equal(min);
        expect(_concat.paths[0].src).is.a('array');
        expect(_concat.paths[0].src[0]).is.equal(__dirname + '/../data/css-tests/less/src/test.less');
        expect(_concat.paths[0].src.length).is.equal(1);

        done();
    });
    it('Test constructor path build with relative path', (done) => {
        let min    = "/test.css",
            config = {
                paths: {}
            };

        config.paths[min] = [
            'less/src/test.less',
            'less/src/test.less',
        ];

        let _concat = new concat(config, {}, {
            distDir: __dirname + '/../data/css-tests',
            outDir : __dirname + '/../data/'
        });

        expect(_concat.paths).is.a('array');
        expect(_concat.paths.length).is.equal(1);
        expect(_concat.paths[0].dest).is.equal(__dirname + '/../data' + min);
        expect(_concat.paths[0].src).is.a('array');
        expect(_concat.paths[0].src[0]).is.equal(__dirname + '/../data/css-tests/less/src/test.less');
        expect(_concat.paths[0].src.length).is.equal(1);

        done();
    });
    it('Test concatenate & build js', (done) => {
        let config = {
            paths: {}
        };
        done();
    });
    it('Test concatenate & build css', (done) => {
        done();
    });
    it('Test concatenate & build & min js', (done) => {
        done();
    });
});