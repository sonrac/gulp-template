/**
 * @author Donii Sergii <doniysa@gmail.com>
 */

/**
 * @const {Function} series Gulp task series. See <a href="https://github.com/iameugenejo/gulps">Documentation</a> for detail
 * @const {Object} connect Connect
 * @const {CopyFiles} copyFiles Copy files class
 * @const {Templates} templates Templates build class
 * @const {Object} _config Template config
 *
 * @ignore _
 * @ignore fs
 * @ignore os
 * @ignore backgrounder
 * @ignore exec
 */
const series          = require('gulp-series'),
      connect         = require('gulp-connect'),
      open            = require('open'),
      _               = require('lodash'),
      os              = require('os'),
      fs              = require('fs'),
      backgrounder    = require("backgrounder"),
      exec            = require('child_process').exec,
      copyFiles       = require('./helpers/CopyFiles'),
      templates       = require("./helpers/Templates"),
      _config         = require("./config.js"),
      buildConfigPath = (config) => {
          let conf = {};

          if (config.outDir) {
              conf.outDir = config.outDir;
          }
          if (config.distDir) {
              conf.distDir = config.distDir;
          }

          return conf;
      },
      copyTask        = (paths, move) => {
          move = move || false;

          if (_.isUndefined(paths)) {
              return;
          }

          let copy = new copyFiles(paths);
          copy.process(move);
      },
      css             = require("./helpers/Css"),
      images          = require("./helpers/Images"),
      mJS             = require("./helpers/JS");

series.registerTasks({
    "server"     : () => {
        let fd;
        fd       = fs.openSync(__dirname + '/.pids', 'r');
        let pids = fs.readFileSync(__dirname + '/.pids');

        if (pids = pids.toString()) {
            pids = pids.toString();
            pids.split(os.EOL).forEach((pid) => {
                exec('kill ' + _.trim(pid));
            });
        }
        fd      = fs.openSync(__dirname + '/.pids', 'w');
        let pid = exec('node ' + __dirname + '/helpers/Server.js > /dev/null 2>/dev/null & echo $!');
        fs.appendFileSync(fd, pid.pid + os.EOL);

    },
    "minify-css" : () => {
        let opt = module.exports.config;

        if (!opt.css) {
            return;
        }

        opt.css = _.isArray(opt.css) ? opt.css : [opt.css];

        opt.css.forEach((next) => {
            let _css = new css(next, opt.liveReloadOptions, buildConfigPath(opt));
            _css.minify();
        });
    },
    "build-css"  : () => {
        let opt = module.exports.config;

        if (!opt.css) {
            return;
        }

        opt.css = _.isArray(opt.css) ? opt.css : [opt.css];

        opt.css.forEach((next) => {
            let _css = new css(next, opt.liveReloadOptions, buildConfigPath(opt));
            _css.build();
        });
    },
    "minify-js"  : () => {
        let opt = module.exports.config;

        if (!opt.js) {
            return;
        }

        opt.js = _.isArray(opt.js) ? opt.js : [opt.js];

        opt.js.forEach((next) => {
            let js = new mJS(next, opt.liveReloadOptions, buildConfigPath(opt));
            js.minify()
        });

    },
    "build-js"   : () => {
        let opt = module.exports.config;

        if (!opt.js) {
            return;
        }

        opt.js = _.isArray(opt.js) ? opt.js : [opt.js];

        opt.js.forEach((next) => {
            let js = new mJS(next, opt.liveReloadOptions, buildConfigPath(opt));

            js.build();
        });
    },
    "imagemin"   : () => {
        let opt = module.exports.config;

        if (!opt.images) {
            return;
        }

        opt.images = _.isArray(opt.images) ? opt.images : [opt.images];

        opt.images.forEach((next) => {
            let imagemin = new images(next, opt.liveReloadOptions, buildConfigPath(opt));
            imagemin.minify();
        });
    },
    "ts"         : () => {
        let opt = module.exports.config;

        if (!opt.ts) {
            return;
        }

        opt.ts = _.isArray(opt.js) ? opt.ts : [opt.ts];

        opt.ts.forEach((next) => {
            next.processor = 'gulp-typescript-babel';
            let ts         = new mJS(next, opt.liveReloadOptions, buildConfigPath(opt));
            ts.build();
        });

    },
    "templates"  : () => {
        let opt = module.exports.config;

        if (!opt.templates) {
            return;
        }

        opt.templates = _.isArray(opt.templates) ? opt.templates : [opt.templates];

        opt.templates.forEach((next) => {
            let template = new templates(next, opt.liveReloadOptions, buildConfigPath(opt));
            template.build();
        });
    },
    "minify-html": () => {
        let opt = module.exports.config;

        if (!opt.templates) {
            return;
        }

        opt.templates = _.isArray(opt.templates) ? opt.templates : [opt.templates];

        opt.templates.forEach((next) => {
            if (!next.enableMin) {
                return;
            }
            let template = new templates(next, opt.liveReloadOptions, buildConfigPath(opt));
            template.minify();
        });
    },
    "coffee"     : () => {
        let opt = module.exports.config;

        if (!opt.coffee) {
            return;
        }

        opt.coffee = _.isArray(opt.js) ? opt.ts : [opt.ts];

        opt.coffee.forEach((next) => {
            next.processor = 'gulp-coffee';
            let coffee     = new mJS(next, opt.liveReloadOptions, buildConfigPath(opt));
            coffee.build();
        });
    },
    "copy"       : () => {
        let opt = module.exports.config;

        if (!opt.copyFiles) {
            return;
        }

        copyTask(opt.copyFiles, false);
    },
    "move"       : () => {
        let opt = module.exports.config;
        if (!opt.moveFiles) {
            return;
        }
        copyTask(opt.moveFiles, true);
    },
    "watch"      : () => {
        let opt = module.exports.config;
    },
    "release"    : (() => {
        gulp.src([_config.build_dir + '/**/**/**/**/**/**/**/**/**/**/*'])
            .pipe(zip('release.zip'))
            .pipe(gulp.dest('.'));
    }),
    "amd-build"  : () => {

    },
    "concat"     : () => {

    }
});

series.registerSeries('minify-css', ['build-css', 'minify-css']);
series.registerSeries('watch', ['watch']);
series.registerSeries('images-move', ['imagemin', 'move']);
series.registerSeries('templates-move', ['templates', 'minify-html', 'move']);
series.registerSeries('minify-css-move', ['minify-css', 'move']);
series.registerSeries('minify-js-move', ['minify-js', 'move']);
series.registerSeries('build', ['build-css', 'build-js', 'server', 'templates', 'minify-css', 'minify-js', 'minify-html', 'imagemin', 'copy', 'move']);
series.registerSeries('default', ['watch', 'build-css', 'build-js', 'templates', 'minify-css', 'minify-js', 'minify-html', 'imagemin', 'copy', 'move', 'server']);

if (_.size(_config.additionalTasks)) {
    series.registerTasks(_config.additionalTasks);
}

if (_.size(_config.additionalSeries)) {
    _.each(_config.additionalSeries, (list, name) => {
        series.registerSeries(name, _.isArray(list) ? list : [list]);
    });
}

module.exports = {
    series: series,
    config: _config
};