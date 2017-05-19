/**
 * @author Donii Sergii <doniysa@gmail.com>
 */

const _           = require('lodash'),
      pathBuilder = require("./PathBuild"),
      rename = require('gulp-rename'),
      cleanCSS = require('gulp-clean-css'),
      concat      = require('gulp-concat');

/**
 * @class Concat
 * Concatenate files
 *
 * @property {Object} liveReloadOptions <a target="_blank" href=https://github.com/vohof/gulp-livereload>Livereload</a> options for concat building
 * @property {Object|Array} paths Config path. See <a href="global.html#pathConfig">For detail</a>
 * @property {String} distDir Distributive folder from config
 * @property {String} outDir Output folder from config
 * @property {Boolean} useAMD Build amd application flag
 * @property {Object} concatOptions Concatenate options
 * @property {Boolean} useAMD
 */
class Concat {

    /**
     * Concat constructor
     * @param {Object} options Concat options
     * @param {Object} liveReloadOptions <a target="_blank" href=https://github.com/vohof/gulp-livereload>Livereload</a> options for concat building
     * @param {{outDir: {String}, distDir: {String}}} defPaths Defined path from config
     * @param {Boolean} useAMD Use amd build
     */
    constructor(options, liveReloadOptions, defPaths, useAMD) {
        defPaths               = defPaths || {};
        this.liveReloadOptions = liveReloadOptions || {};
        this.paths             = options.paths;
        this.outDir            = defPaths.outDir;
        this.distDir           = defPaths.distDir;
        this.concatOptions     = options.concatOptions;
        this.useAMD            = useAMD || false;
        this.configFile        = options.configFile;
        this.sourcePath        = options.sourcePath;
        this.minPath           = options.minPath;
        this.minifyOptions     = options.minifyOptions;

        this.processPath();
    }

    /**
     * Process parse paths
     */
    processPath() {

        let paths = [];
        _.each(this.paths, (path, dest) => {
            paths.push({
                dest: dest,
                src : path
            });
        });

        this.paths = (new pathBuilder(paths, this.outDir, {
            distDir: this.distDir,
            outDir : this.outDir
        }, true)).processFullPath(true);
    }

    /**
     * Run concatenate files
     */
    runConcat() {

    }

    runConcatAmd() {

    }

    runMinifyAMD() {

    }

    /**
     * Run minify files
     */
    runMinify() {

    }

    /**
     * Run watch files changed
     */
    runWatch() {

    }
}

module.exports = Concat;