/**
 * @author Donii Sergii <doniysa@gmail.com>
 */

const chai      = require('chai'),
      expect    = chai.expect,
      _         = require('lodash'),
      fs        = require('fs'),
      helper    = require("./../helper"),
      Templates = require("./../../helpers/Templates");

chai.use(require('chai-fs'));

let templates = new helper.buildTest({
    extFile      : 'html',
    minifySuffix : '.min',
    buildObject  : Templates,
    optionName   : 'css',
    task         : 'templates',
    isEqualString: false,
    configName   : 'templates',
    taskMinify   : 'minify-html',
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

        if (!series.config[obj.configName].processorOptions) {
            series.config[obj.configName].processorOptions = {};
        }

        series.config[obj.configName].processorOptions.pretty = true;
        series.config[obj.configName].enableMin               = true;

        return series.config;
    },
    dir          : 'templates',
    dataString   : "<div class=\"div class\">Test</div>",
    dataStringMin: "<div class=\"div class\">Test</div>"
});

describe('Test Templates constructor', () => {
    it('Test simple options', (done) => {
        let templates = new Templates({
            paths    : ['1'],
            sourceExt: 'pug',
        }, {}, {
            outDir : __dirname,
            distDir: __dirname
        });

        expect(templates.paths.length).is.equal(1);
        expect(templates.paths[0]).is.equal('1');
        expect(templates.getBuildPaths()).is.a('Array');
        expect(_.size(templates.getBuildPaths())).is.equal(1);

        done();
    });

    templates.build('gulp-pug', 'pug', 'pug');
    templates.build('gulp-pug', 'pug', 'pug', true);
});