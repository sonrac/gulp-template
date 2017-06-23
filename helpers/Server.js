/**
 * @author Donii Sergii <doniysa@gmail.com>
 */

/**
 * @ignore _
 * @ignore gulp
 * @ignore connect
 * @ignore config
 */

const _       = require('lodash'),
      connect = require('gulp-connect'),
      config  = require("./../config");

/*

 */
/**
 * @class Server
 * Server runner in background
 *
 * @property {Object} options Server options. See <a href="global.html#config">Config server options</a>
 * @property {Number} port Server port
 * @property {String} root Root server folder
 *
 * @author Donii Sergii<doniysa@gmail.com>
 */
class Server {
    /**
     *
     * @param {Object} options Server options
     * @param {String} outDir Default output dir from config
     *
     * @author Donii Sergii<doniysa@gmail.com>
     */
    constructor(options, outDir) {
        this.options = options || {};

        this.options.root       = this.options.root || (this.options.path || (outDir || __dirname)).replace(/\/\//g, '');
        this.options.port       = this.options.port || 1112;
        this.options.livereload = this.options.livereload || true;
    }

    /**
     * Run local server
     *
     * @author Donii Sergii<doniysa@gmail.com>
     */
    run() {
        connect.server(this.options);
    }
}

let server = new Server(config.server, config.outDir);

server.run();

module.exports = {
    server     : server,
    serverClass: Server
};