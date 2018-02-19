import {} from 'mocha'
import * as assert from 'assert'

import {ExecuteSuiteRequest as Request} from '../ghost-inspector/requests'

describe('requests.ExecuteSuiteRequest', function () {
  it('should instantiate a request object', function () {
    const request = new Request('some-apikey', 'some-suiteId', 'https://somewhere.com', '{}')
    assert.equal(request.apiKey, 'some-apikey', 'apiKey')
    assert.equal(request.suiteId, 'some-suiteId', 'suiteId')
    assert.equal(request.startUrl, 'https://somewhere.com', 'startUrl')
    assert.deepEqual(request.params, {}, 'params')
  })

  it('should throw an error if `rawParams` can not be JSON decoded', function () {
    assert.throws(() => {
      const request = new Request('some-apikey', 'some-suiteId', 'https://somewhere.com', 'bogus')
    }, (error:Error) => {
      assert.equal(error.message, 'Params must be JSON-decodable.')
      return true
    })
  })

  it('should JSON-decode raw params', function () {
    const request = new Request('some-apikey', 'some-suiteId', 'https://somewhere.com', '{"browser": "chrome"}')
    assert.equal(request.params.browser, 'chrome')
  })

  it('should handle `null` raw params', function () {
    const request = new Request('some-apikey', 'some-suiteId', 'https://somewhere.com', null)
    assert.deepEqual(request.params, {})
  })

  it('should pick `startUrl` over `params.startUrl` if both provided', function () {
    const request = new Request('some-apikey', 'some-suiteId', 'https://somewhere.com', '{"startUrl": "https://elsewhere.com"}')
    assert.equal(request.startUrl, 'https://somewhere.com')
  })
})