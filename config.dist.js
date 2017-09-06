/**
 * Created by Donii Sergii <doniysa@gmail.com> on 5/1/17.
 */

/**
 * @content Test tag
 */

/**
 * @const {Object} pathConfig
 * Config paths definitions. It's a virtual constants (for documentation) and tell you about path generate.
 *
 * You can definition as strings array path, destination folder will be put from <a href="global.html#config">config.outDir</a> and src will be everyone string
 * <br/>
 * <br/>
 * You can use relative path or full. If you used relative path, you must define <a href="global.html#config">config.outDir</a> and <a href="global.html#config">config.distDir</a> in your config file
 * <br/>
 * <br/>
 * In the obligatory case, that was not transferred after processing, this config will consist of an array of objects with two properties:
 * @property {String} src Source folder
 * @property {String} dest Destination folder
 * @see PathBuild
 *
 */

/**
 * @const {Object} config
 * Config options
 *
 * @property {String} distDir Base path to distributive (must be fully)
 * @property {String} outDir Base path to output dir (must be fully)
 *
 * @property {Object} server Server config
 * @property {String} server.path Path to server
 * @property {Number} server.port Server port
 * @property {Boolean} server.openInBrowser Open default Browser after start7
 *
 * @property {Object} liveReloadOptions Live reload options. Options list see on <a target="_blank" href=https://github.com/vohof/gulp-livereload>gulp-livereload API</a>
 *
 * @property {Object|Array} css CSS Options. If you want usage several processor, define as array object, options are (for everyone):
 * @property {Object|Array|String} css.path Config path. See <a href="global.html#pathConfig">For detail</a>
 * @property {Array} css.ignores Ignores pattern which will be adding to all <code>gulp.src</code> functions for css build
 * @property {String} css.processor Package name for build
 * @property {Object} css.liveReloadOptions <a target="_blank" href=https://github.com/vohof/gulp-livereload>Livereload</a> options for css building
 * @property {Function|undefined} css.additionalMinifyWatchCallback Additional minify watch callback. Called on <a href="Css.html">Css class</a>
 * @property {Function|undefined} css.additionalBuildCallback Additional build callback. Called on <a href="Css.html">Css class</a>
 * @property {Function|undefined} css.additionalWatchCallback Additional watch callback. Called on <a href="Css.html">Css class</a>
 * @property {Function|undefined} css.additionalMinifyWatchCallback Additional minify watch callback. Called on <a href="Css.html">Css class</a>
 * @property {Function|undefined} css.minifyOptions Options for <a target="_blank" href="https://www.npmjs.com/package/gulp-clean-css">gulp-clean-css</a> package
 * @property {String|undefined} css.minifySuffix Minify suffix for min file versions. By default is <code>.min</code>
 * @property {String|Array} css.watchTasks Task which will be run on build files watcher. Be default is <code>build-css</code>
 * @property {String|Array} css.watchMinifyTasks Task which will be run on minify files watcher. Be default is <code>minify-css</code>
 * @property {Array|Object} css.additionalMinifyPath Additional minify files pattern which will be adding to all <code>gulp.src</code> functions for minify css. See <a href="global.html#pathConfig">Path config options</a> for detail
 * @property {Boolean} css.enableMin Enable or disable run minify task & watcher. By default is true
 * @property {Object} css.processorOptions Options for gulp package which will be build css. Testing on <a target="_blank" href="https://github.com/stevelacy/gulp-stylus">gulp-stylus</a>, <a target="_blank" href="https://github.com/dlmanning/gulp-sass">gulp-sass</a> and <a target="_blank" href="https://github.com/stevelacy/gulp-less">gulp-less</a>
 *
 * @property {Object} images Images optimize config
 * @property {String} images.processorName NPM package name for image optimizer (by default is <a href="" target="blank">gulp-imagemin</a>
 * @property {Object} images.liveReloadOptions Options for <a target="_blank" href=https://github.com/vohof/gulp-livereload>Livereload</a>
 * @property {Object} images.paths Config path. See <a href="global.html#pathConfig">For detail</a>
 *
 * @property {Object|Array} templates CSS Options. If you want usage several processor, define as array object, options are (for everyone):
 * @property {Object|Array|String} templates.path Config path. See <a href="global.html#pathConfig">For detail</a>
 * @property {Array} templates.ignores Ignores pattern which will be adding to all <code>gulp.src</code> functions for templates build
 * @property {String} templates.processor Package name for build
 * @property {Object} templates.liveReloadOptions <a target="_blank" href=https://github.com/vohof/gulp-livereload>Livereload</a> options for templates building
 * @property {Function|undefined} templates.additionalMinifyWatchCallback Additional minify watch callback. Called on <a href="Templates.html">Templates class</a>
 * @property {Function|undefined} templates.additionalBuildCallback Additional build callback. Called on <a href="Templates.html">Templates class</a>
 * @property {Function|undefined} templates.additionalWatchCallback Additional watch callback. Called on <a href="Templates.html">Templates class</a>
 * @property {Function|undefined} templates.additionalMinifyWatchCallback Additional minify watch callback. Called on <a href="Templates.html">Templates class</a>
 * @property {Function|undefined} templates.minifyOptions Options for <a target="_blank" href="https://github.com/jonschlinkert/gulp-htmlmin">gulp-minhtml</a> package
 * @property {String|undefined} templates.minifySuffix Minify suffix for min file versions. By default is <code>.min</code>
 * @property {String|Array} templates.watchTasks Task which will be run on build files watcher. Be default is <code>minify-html</code>
 * @property {String|Array} templates.watchMinifyTasks Task which will be run on minify files watcher. Be default is <code>minify-html</code>
 * @property {Array|Object} templates.additionalMinifyPath Additional minify files pattern which will be adding to all <code>gulp.src</code> functions for minify templates. See <a href="global.html#pathConfig">Path config options</a> for detail
 * @property {Boolean} templates.enableMin Enable or disable run minify task & watcher. By default is true
 * @property {Object} templates.processorOptions Options for gulp package which will be build templates. Testing on <a target="_blank" href="https://github.com/pugjs/gulp-pug">gulp-pug</a>
 *
 * @property {Object|Array} js JS build Options. If you want usage several processor, or several distributive dir define as array object, options are (for everyone):
 * @property {Object|Array|String} js.paths Config path. See <a href="global.html#pathConfig">For detail</a>
 * @property {Array} js.ignores Ignores pattern which will be adding to all <code>gulp.src</code> functions for js build
 * @property {String} js.processor Package name for build
 * @property {Object} js.liveReloadOptions <a target="_blank" href=https://github.com/vohof/gulp-livereload>Livereload</a> options for js building
 * @property {Function|undefined} js.additionalMinifyWatchCallback Additional minify watch callback. Called on <a href="Js.html">JS class</a>
 * @property {Function|undefined} js.additionalBuildCallback Additional build callback. Called on <a href="Js.html">JS class</a>
 * @property {Function|undefined} js.additionalWatchCallback Additional watch callback. Called on <a href="Js.html">JS class</a>
 * @property {Function|undefined} js.additionalMinifyWatchCallback Additional minify watch callback. Called on <a href="Js.html">JS class</a>
 * @property {Function|undefined} js.minifyOptions Options for <a target="_blank" href="https://github.com/terinjokes/gulp-uglify">gulp-uglify/a> package
 * @property {String|undefined} js.minifySuffix Minify suffix for min file versions. By default is <code>.min</code>
 * @property {String|Array} js.watchTasks Task which will be run on build files watcher. Be default is <code>build-js</code>
 * @property {String|Array} js.watchMinifyTasks Task which will be run on minify files watcher. Be default is <code>minify-js</code>
 * @property {Array|Object} js.additionalMinifyPath Additional minify files pattern which will be adding to all <code>gulp.src</code> functions for minify js. See <a href="global.html#pathConfig">Path config options</a> for detail
 * @property {Boolean} js.enableMin Enable or disable run minify task & watcher. By default is true
 * @property {Object} js.processorOptions Options for gulp package which will be build js. Testing on <a target="_blank" href="https://github.com/stevelacy/gulp-stylus">gulp-stylus</a>, <a target="_blank" href="https://github.com/dlmanning/gulp-sass">gulp-sass</a> and <a target="_blank" href="https://github.com/stevelacy/gulp-less">gulp-less</a>
 * @property {Object} js.originalConfig Config which giving in constructor
 * @property {Object|Array} js.paths Paths
 * @property {Object|Array} js.processorOptions Processor options
 * @property {Array|Object|undefined} js.additionalMinifyPath Additional minify paths
 * @property {Array|Object|undefined} js.additionalMinifyWatchCallback Additional minify watch paths
 * @property {Array|Object|undefined} js.additionalBuildCallback Additional build paths config
 * @property {Array|Object|undefined} js.additionalBuildCallback Additional build paths config
 * @property {Array|Object|undefined} js.minifyOptions Options for <a href="https://github.com/terinjokes/gulp-uglify" target="_blank">gulp-uglify</a> package
 * @property {Function|undefined} js.additionalMinifyWatchCallback Additional minify watch callback
 * @property {Function|undefined} js.additionalMinifyCallback Additional minify callback
 * @property {String} js.minifySuffix Suffix for minified files
 * @property {String} js.defaultProcessor Default processor
 * @property {String|Array} js.defTasks Default run tasks
 * @property {String|Array} js.watchTasks Watch tasks for build paths
 * @property {String|Array} js.watchMinifyTasks Watch tasks for minify paths
 * @property {Object} js.configPaths Default path from config
 * @property {Object|Array} js.ignores Ignore files pattern
 * @property {Object} js.babelOptions Options for gulp-babel package
 *
 * @property {Object|Array} copyFiles Copy files config
 * @property {Object|Array} copyFiles.paths Copy files config path. See <a href="global.html#pathConfig">For detail</a>
 * @property {Object|Array} copyFiles.tasks Tasks list for watch. Default is <code>copy</code>
 * @property {Function} copyFiles.rsyncOptions Additional <a href="https://github.com/mattijs/node-rsync" target='_blank'>rsync</a> callback for adding wrapper options
 *
 * @property {Object|Array} moveFiles Move files config
 * @property {Object|Array} moveFiles.paths Copy files config path. See <a href="global.html#pathConfig">For detail</a>
 * @property {Object|Array} moveFiles.tasks Tasks list for watch. Default is <code>move</code>
 * @property {Function} moveFiles.rsyncOptions Additional <a href="https://github.com/mattijs/node-rsync" target='_blank'>rsync</a> callback for adding wrapper options
 *
 * @property {Object} additionalTasks Additional tasks list in format "taskName": () => {... task body ...}
 * @property {Object} additionalSeries Additional tasks series list in format "seriesName": [... tasks list ...]
 *
 * @property {Object} requireJSConcat AMD build app config
 * @property {String} requireJSConcat.configFile Path to require.js config file
 * @property {Object} requireJSConcat.minOptions Options for <a href="https://github.com/terinjokes/gulp-uglify" target="_blank">gulp-uglify</a> building amd file
 * @property {Object} requireJSConcat.sourcePath Path to output build file
 * @property {String} requireJSConcat.minPath Path to minified builded file
 * @property {Object} requireJSConcat.requireJSConfig Additional options for <a href="https://github.com/jorrit/gulp-requirejs">gulp-requirejs</a>
 * @property {String} requireJSConcat.requireJSConfig.baseUrl Base path to source dir
 * @property {String} requireJSConcat.requireJSConfig.outFile Output filename
 * @property {String} requireJSConcat.requireJSConfig.configFile Relative path to bootstrap require.js file
 *
 * @property {Object} concat Concatenate files config
 * @property {Object} concat.paths Paths in format 'outfileName': [... files list ...]
 * @property {Object} concat.concatOptions Options for <a href="https://github.com/contra/gulp-concat" target="_blank">gulp-concat</a>
 * @property {Object} concat.minifyOptions Minify options for <a href="https://github.com/terinjokes/gulp-uglify" target="_blank">gulp-uglify</a>
 *
 * @author Donii Sergii<doniysa@gmail.com>
 */
const config = {

    distDir          : __dirname + '/tests/test-project/dist',
    outDir           : __dirname + '/tests/test-project/build',
    server           : {
        path         : __dirname + '/tests/test-project/build',
        port         : 1112,
        openInBrowser: true,
    },
    liveReloadOptions: {},
    css              : {
        paths                        : [
            {
                src : 'less/**/**/*.less',
                dest: 'css/'
            }
        ],
        ignorePatterns               : [
            '!tests/test-project/dist/less/**/**/_*.less',
            '!tests/test-project/dist/less/layouts/*.less',
        ],
        processor                    : 'gulp-less',
        liveReloadOptions            : {},
        additionalWatchCallback      : () => {
        },
        additionalBuildCallback      : () => {
        },
        additionalMinifyCallback     : () => {
        },
        additionalMinifyWatchCallback: () => {
        },
        additionalBuildWaCallback    : () => {
        },
        minifyOptions                : {
            compatibility: 'ie9'
        },
        minifySuffix                 : '.min',
        watchTasks                   : ['build-css'],
        watchMinifyTasks             : ['minify-css'],
        additionalMinifyPath         : [],
    },
    images           : {
        paths: [
            {
                src : __dirname + '/tests/data/images/src/*',
                dest: __dirname + '/tests/data/images/out',
            }
        ]
    },
    templates        : {
        paths                        : [
            {
                src : 'templates/**/**/*.pug',
                dest: ''
            }
        ],
        ignorePatterns               : [
            '!tests/test-project/dist/templates/layouts/*.pug'
        ],
        processor                    : 'gulp-pug',
        processorOptions             : {
            pretty: true
        },
        liveReloadOptions            : {},
        additionalWatchCallback      : () => {
        },
        additionalBuildCallback      : () => {
        },
        additionalMinifyCallback     : () => {
        },
        additionalMinifyWatchCallback: () => {
        },
        additionalBuildWaCallback    : () => {
        },
        minifyOptions                : {
            compatibility: 'ie9'
        },
        minifySuffix                 : '.min',
        watchTasks                   : ['build-css'],
        watchMinifyTasks             : ['minify-css'],
        additionalMinifyPath         : [],
        enableMin                    : true
    },
    js               : {
        paths                        : [
            {
                src : 'js/*.js',
                dest: 'js/'
            }
        ],
        babelOptions                 : {
            presets: ['es2015']
        },
        processorOptions             : {
            presets: ['es2015']
        },
        processor                    : 'gulp-babel',
        liveReloadOptions            : {},
        additionalWatchCallback      : () => {
        },
        additionalBuildCallback      : () => {
        },
        additionalMinifyCallback     : () => {
        },
        additionalMinifyWatchCallback: () => {
        },
        additionalBuildWaCallback    : () => {
        },
        minifyOptions                : {
            compatibility: 'ie9'
        },
        minifySuffix                 : '.min',
        watchTasks                   : ['build-css'],
        watchMinifyTasks             : ['minify-css'],
        additionalMinifyPath         : []

    },
    copyFiles        : {
        rsyncOptions: {},
        paths       : [
            {
                src : __dirname + '/tests/test-project/dist/plugins',
                dest: __dirname + '/tests/test-project/build/'
            }
        ]
    },
    moveFiles        : {
        rsyncOptions: {},
        paths       : [
            {
                src : __dirname + '/tests/test-project/build/plugins/yii/yii.js',
                dest: __dirname + '/tests/test-project/build/plugins'
            }
        ]
    },
    concat          : {
        paths: {
            'js-concat.js': [
                'js/main.js',
                'js/tabular.js',
            ],
        }
    },
    additionalTasks  : {},
    additionalSeries : {},
    requireJSConcat  : {
        configFile     : '',
        minOptions     : {},
        sourcePath     : '',
        minPath        : '',
        outFile        : '',
        requireJSConfig: {}
    },
};

module.exports = config;