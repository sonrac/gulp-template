/**
 * @author Donii Sergii <doniysa@gmail.com>
 */

const fs = require('fs');

let objHelper = {
    checkConfig  : () => {
        if (fs.existsSync(__dirname + '/../config.js') && !fs.existsSync(__dirname + '/../config-old.js')) {
            fs.renameSync(__dirname + '/../config.js', __dirname + '/../config-old.js');
        }

        fs.writeFileSync(__dirname + '/../config.js', fs.readFileSync(__dirname + '/../config.dist.js').toString());
    },
    restoreConfig: () => {

        if (fs.existsSync(__dirname + '/../config-old.js')) {
            fs.writeFileSync(__dirname + '/../config.js', fs.readFileSync(__dirname + '/../config.dist.js').toString());
            fs.unlinkSync(__dirname + '/../config-old.js');
        }

    }
};

objHelper.checkConfig();

module.exports = objHelper;