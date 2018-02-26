import * as assert from 'assert'
import {} from 'mocha'
import * as sinon from 'sinon'
import axios from 'axios'

import {ExecuteSuiteRequest as Request} from '../ghost-inspector/requests'
import {Suite as Service} from '../ghost-inspector/services'

describe('services.Suite', function () {

  it('should instantiate a service object', function () {
    const request = new Request('some-apikey', 'some-suiteId', 'https://somewhere.com', '{}')
    const service = new Service(request)
    assert.ok(service)
  })

  it('should construct a basic URL', function () {
    const request = new Request('some-apikey', 'some-suiteId', 'https://somewhere.com', '{}')
    const service:any = new Service(request)
    assert.equal(service.suiteExecuteUrl, 'https://api.ghostinspector.com/v1/suites/some-suiteId/execute/?apiKey=some-apikey')
  })

  it('should have appropriate post params', function () {
    const request = new Request('some-apikey', 'some-suiteId', 'https://somewhere.com', '{"browser": "chrome", "myVar": "hello"}')
    const service:any = new Service(request)
    assert.equal(service.body.browser, 'chrome', 'browser')
    assert.equal(service.body.myVar, 'hello', 'myVar')
    assert.equal(service.body.immediate, 1, 'immediate')
  })

  it('should execute the request', async function () {
    let mockrequest = sinon.stub(axios, 'post').callsFake(async function (): Promise<any> {
      return {data: {data: {_id: '1234'}}}
    })
    let mockpoll = sinon.stub(Service.prototype, 'poll').callsFake(async function (): Promise<any> {
      return true
    })
    const request = new Request('some-apikey', 'some-suiteId', 'https://somewhere.com', '{"browser": "chrome", "myVar": "hello"}')
    const service = new Service(request)
    const results = await service.execute()
    assert.ok(mockrequest.called)
    assert.ok(mockpoll.called)

    // clean up
    mockrequest.restore()
    mockpoll.restore()
  })

  it('should poll and return a result', async function () {
    const passingNull = {data: {data: {passing:null}}}
    const passingTrue = {data: {data: {passing:true}}}

    let mockrequest:any = sinon.stub(axios, 'get')
    mockrequest.onFirstCall().resolves(passingNull)
    mockrequest.onSecondCall().resolves(passingNull)
    mockrequest.onThirdCall().resolves(passingTrue)

    let mocksleep:any = sinon.stub(Service.prototype, 'sleep')
    mocksleep.resolves()

    const request = new Request('some-apikey', 'some-suiteId', 'https://somewhere.com', '{"browser": "chrome", "myVar": "hello"}')
    const service = new Service(request)
    const result = await service.poll('1234')
    assert.ok(result === true)

    // clean up
    mockrequest.restore()
    mocksleep.restore()
  })

})

/**
 * TODO:
 *  - test empty suite result ID
 *  - test bad auth on service
 *  - test network timeout
 *  - test polling
 */
