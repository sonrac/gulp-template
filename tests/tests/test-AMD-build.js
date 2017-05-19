/**
 * @author Donii Sergii <doniysa@gmail.com>
 */

const chai   = require('chai'),
      _      = require('lodash'),
      concat = require("./../../helpers/Concat");

chai.use(require('chai-fs'));

/**
 *
 */
describe('AMD test build', () => {
    it('Test amd build', () => {
        let config = {
            configFile: __dirname + '/../data/test-project/amd/config.js',

        };
    });
});