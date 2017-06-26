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
      WATCH_BUILD     = 1,
      WATCH_MINIFY    = 2,
      WATCH_ALL       = 2,
      concat          = require('./helpers/Concat'),
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
      gulp            = require('gulp'),
      copyTask        = (confName, move, onlyWatch) => {
          let opt = module.exports.config;

          if (!opt[confName]) {
              return;
          }

          move = move || false;

          let paths = opt[confName];

          if (_.isUndefined(paths)) {
              return;
          }

          if (move) {
              paths.tasks = paths.tasks || 'move';

          }

          let copy = new copyFiles(paths);
          if (!onlyWatch) {
              copy.process(move);
          } else {
              copy.buildWatch();
          }
      },
      nextBuildTask   = (configName, construct, minify, watchType) => {
          let opt = module.exports.config;

          if (!opt[configName]) {
              return;
          }

          opt[configName] = _.isArray(opt[configName]) ? opt[configName] : [opt[configName]];

          opt[configName].forEach((next) => {
              let object = new construct(next, opt.liveReloadOptions, buildConfigPath(opt));
              if (!minify || _.isString(minify)) {
                  if (!watchType) {
                      object.build();
                  } else {
                      switch (watchType) {
                          case WATCH_BUILD:
                              object.buildWatch();
                              break;
                          case WATCH_MINIFY:
                              object.minifyWatch();
                              break;
                          case WATCH_ALL:
                              object.buildWatch();
                              object.minifyWatch();
                          default:
                              object[watchType]();
                              break;
                      }
                  }
              }

              if (minify && _.isBoolean(minify)) {
                  object.minify();
              }
          });
      },
      css             = require("./helpers/Css"),
      images          = require("./helpers/Images"),
      mJS             = require("./helpers/JS");

series.registerTasks({
    "server"         : () => {
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
    "minify-css"     : () => {
        nextBuildTask.call(this, ['css', css, true]);
    },
    "build-css"      : () => {
        nextBuildTask.call(this, ['css', css]);
    },
    "minify-js"      : () => {
        nextBuildTask.call(this, ['js', mJS, true]);

    },
    "build-js"       : () => {
        nextBuildTask.call(this, ['js', mJS]);
    },
    "imagemin"       : () => {
        nextBuildTask.call(this, ['images', images, true]);
    },
    "ts"             : () => {
        nextBuildTask.call(this, ['ts', mJS]);
    },
    "templates"      : () => {
        nextBuildTask.call(this, ['templates', templates]);
    },
    "minify-html"    : () => {
        nextBuildTask.call(this, ['templates', templates, true]);
    },
    "coffee"         : () => {
        nextBuildTask.call(this, ['coffee', mJs]);
    },
    "copy"           : () => {
        copyTask('copyFiles', false);
    },
    "move"           : () => {
        copyTask('moveFiles', true);
    },
    "release"        : () => {
        gulp.src([_config.build_dir + '/**/**/**/**/**/**/**/**/**/**/*'])
            .pipe(zip('release.zip'))
            .pipe(gulp.dest('.'));
    },
    "amd-build"      : () => {

    },
    "concat"         : () => {
        nextBuildTask.call(this, ['concat', concat]);
    },
    "concat-minify"  : () => {
        nextBuildTask.call(this, ['concat', concat, true]);
    },
    "watch-css"      : () => {
        nextBuildTask.call(this, ['css', css, 'all', WATCH_ALL]);
    },
    "watch-js"       : () => {
        nextBuildTask.call(this, ['js', mJS, 'all', WATCH_ALL]);
        nextBuildTask.call(this, ['ts', mJS, 'all', WATCH_ALL]);
        nextBuildTask.call(this, ['coffee', mJS, 'all', WATCH_ALL]);

    },
    "watch-templates": () => {
        nextBuildTask.call(this, ['templates', templates, false, WATCH_BUILD]);
    },
    "watch-copy"     : () => {
        copyTask('copyFiles', false, true);
    },
    "watch-move"     : () => {
        copyTask('moveFiles', true, true);
    },
    "watch-images"   : () => {
        nextBuildTask.call(this, ['images', images, false, WATCH_BUILD]);
    },
    "watch-coffee"   : () => {
        nextBuildTask.call(this, ['coffee', mJS, false, WATCH_ALL]);
    },
    "watch-ts"       : () => {
        nextBuildTask.call(this, ['ts', mJS, false, WATCH_ALL]);
    },
    "watch-amd-build": () => {
    },
    "watch-concat"   : () => {
        nextBuildTask.call(this, ['concat', concat, 'all', WATCH_ALL]);
    },

});

series.registerSeries('s-minify-css', ['build-css', 'minify-css']);
series.registerSeries('s-watch', ['watch-css', 'watch-js', 'watch-images', 'watch-copy', 'watch-move', 'watch-concat']);
series.registerSeries('watch', ['watch-css', 'watch-js', 'watch-images', 'watch-copy', 'watch-move', 'watch-concat']);
series.registerSeries('s-watch-all', ['watch-css', 'watch-js', 'watch-images', 'watch-copy', 'watch-move', 'watch-concat', 'watch-amd-build', 'watch-ts', 'watch-coffee']);
series.registerSeries('s-images-move', ['imagemin', 'move']);
series.registerSeries('s-templates-move', ['templates', 'minify-html', 'move']);
series.registerSeries('s-minify-css-move', ['minify-css', 'move']);
series.registerSeries('s-minify-js-move', ['minify-js', 'move']);
series.registerSeries('build', ['build-css', 'build-js', 'server', 'templates', 'minify-css', 'minify-js', 'minify-html', 'imagemin', 'copy', 'move']);
series.registerSeries('s-build', ['build-css', 'build-js', 'server', 'templates', 'minify-css', 'minify-js', 'minify-html', 'imagemin', 'copy', 'move']);
series.registerSeries('default', ['watch', 'build-css', 'build-js', 'templates', 'minify-css', 'minify-js', 'minify-html', 'imagemin', 'copy', 'move', 'server']);
series.registerSeries('s-default', ['watch', 'build-css', 'build-js', 'templates', 'minify-css', 'minify-js', 'minify-html', 'imagemin', 'copy', 'move', 'server']);

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