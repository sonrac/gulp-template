/**
 * @author Donii Sergii <doniysa@gmail.com>
 */

/**
 * @class {PrepareOptions}
 * Prepare options helper
 *
 * @property {Object} options Options for prepare config. Replace timestamp if defined
 *
 * @author Donii Sergii<doniysa@gmail.com>
 */
class PrepareOptions {

  /**
   * @constructor PrepareOptions
   *
   * @param {Object} options Config options
   *
   * @author Donii Sergii<doniysa@gmail.com>
   */
  constructor (options) {
    this.options = options
  }

  /**
   * Prepare template
   *
   * @returns {{}}
   *
   * @author Donii Sergii<doniysa@gmail.com>
   */
  processTemplate () {
    let RetOptions = {},
        options    = this.options
    if (typeof options !== 'object') {
      return {}
    }

    for (let i in options) {
      if (!options.hasOwnProperty(i)) {
        continue
      }

      if (typeof options[i] === 'object') {
        RetOptions[i] = __self.buildTemplateOptions(options[i])
      }

      if (typeof options[i].indexOf === 'function' && options[i].indexOf('-----timestamp------') !== -1) {
        RetOptions[i] = options[i].replace('-----timestamp------', Date.now)
      } else if (typeof options[i] === 'function') {
        options[i] = options[i](i, options, options[i])
      } else {
        RetOptions[i] = options[i]
      }
    }

    return RetOptions
  }
}

module.exports = PrepareOptions