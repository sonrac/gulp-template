/**
 * @author Donii Sergii <doniysa@gmail.com>
 */

const chai   = require('chai'),
      expect = chai.expect,
      _      = require('lodash'),
      fs     = require('fs'),
      helper = require("./../helper"),
      Css    = require("./../../helpers/Css");

chai.use(require('chai-fs'));

let build = new helper.buildTest({
    extFile      : 'css',
    minifySuffix : '.min',
    buildObject  : Css,
    optionName   : 'css',
    task         : 'build-css',
    isEqualString: false,
    configName   : 'css',
    taskMinify   : 'minify-css',
    buildCallback: (obj, series, processorName, path, ext, optional, _config, pattern) => {
        series.config[obj.configName].paths = optional ? [
            {
                src : '/src/*.' + ext,
                dest: 'out'
            }
        ] : [
            {
                src : __dirname + '/../data/' + obj.dir + '/' + path + '/src/*.' + ext,
                dest: __dirname + '/../data/' + obj.dir + '/' + path + '/out'
            }
        ];

        return series.config;
    },
    dir          : 'css-tests',
    dataString   : "body {\n  color: ",
    dataStringMin: "body{color:#00f}"
});

describe('Test CSS constructor', () => {
    it('Test simple options', (done) => {
        let css = new Css({
            paths: ['1']
        }, {}, {
            outDir : __dirname,
            distDir: __dirname
        });

        expect(css.paths.length).is.equal(1);
        expect(css.paths[0]).is.equal('1');
        expect(css.getBuildPaths()).is.a('Array');
        expect(_.size(css.getBuildPaths())).is.equal(1);

        done();
    });

    build.build('gulp-less', 'less', 'less');
    build.build('gulp-less', 'less', 'less', true);
    build.build('gulp-sass', 'sass', 'scss');
    build.build('gulp-sass', 'sass', 'scss', true);
    build.build('gulp-stylus', 'stylus', 'styl');
    build.build('gulp-stylus', 'stylus', 'styl', true);
});