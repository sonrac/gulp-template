/**
 * @author Donii Sergii <doniysa@gmail.com>
 */

const fs = require('fs');

let objHelper = {
    checkConfig  : () => {
        if (fs.existsSync(__dirname + '/../config.js')) {
            fs.renameSync(__dirname + '/../config.js', __dirname + '/../config-old.js');
        }

        fs.writeSync(fs.openSync(__dirname + '/../config.js', 'w'), fs.readFileSync(__dirname + '/../config.dist.js'));
    },
    restoreConfig: () => {

        if (fs.existsSync(__dirname + '/../config-old.js')) {
            fs.writeSync(fs.openSync(__dirname + '/../config.js', 'w'), fs.readFileSync(__dirname + '/../config.dist.js'));
            fs.unlinkSync(__dirname + '/../config-old.js');
        }

    }
};

objHelper.checkConfig();

module.exports = objHelper;