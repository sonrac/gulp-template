/**
 * @author Donii Sergii <doniysa@gmail.com>
 */

const chai    = require('chai'),
      expect  = chai.expect,
      fs      = require('fs'),
      prepare = require('./../../helpers/PrepareOptions')

describe('Prepare template options test', () => {
  let _prepare = new prepare({
    pretty: true,
    time  : '-----timestamp------'
  })
  it('Test config set', (done) => {

    expect(_prepare.processTemplate()).is.a('Object')
    expect(_prepare.processTemplate().pretty).is.equal(true)
    expect(_prepare.processTemplate().time).is.a('string')
    expect(parseInt(_prepare.processTemplate().time)).is.a('number')
    done()
  })
})