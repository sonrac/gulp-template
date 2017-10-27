/**
 * @author Donii Sergii <doniysa@gmail.com>
 */

const fs = require('fs'),
      pathObj = require('path')

let objHelper = {
  checkConfig  : () => {
    if (fs.existsSync(pathObj.join(__dirname, '/../config.js') && !fs.existsSync(pathObj.join(__dirname, '/../config-old.js')))) {
      fs.renameSync(pathObj.join(__dirname, '/../config.js', pathObj.join(__dirname, '/../config-old.js')))
    }

    fs.writeFileSync(pathObj.join(__dirname, '/../config.js'), fs.readFileSync(pathObj.join(__dirname, '/../config.dist.js')).toString())
  },
  restoreConfig: () => {

    if (fs.existsSync(pathObj.join(__dirname, '/../config-old.js'))) {
      fs.writeFileSync(pathObj.join(__dirname, '/../config.js'), fs.readFileSync(pathObj.join(__dirname, '/../config.dist.js')).toString())
      fs.unlinkSync(pathObj.join(__dirname, '/../config-old.js'))
    }

  }
}

objHelper.checkConfig()

module.exports = objHelper