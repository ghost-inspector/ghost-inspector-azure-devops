import * as assert from 'assert'
import {} from 'mocha'
import * as sinon from 'sinon'
import axios from 'axios'

import {ExecuteSuiteRequest as Request} from '../ghost-inspector/requests'
import {Suite as Service} from '../ghost-inspector/services'

describe('services.Suite', function () {

  beforeEach(function () {
    this.sandbox = sinon.createSandbox()
  })

  afterEach(function () {
    this.sandbox.restore()
  })

  it('should instantiate a service object', function () {
    const request = new Request('some-apikey', 'some-suiteId', 'https://somewhere.com', '{}')
    const service = new Service(request)
    assert.ok(service)
  })

  it('should construct a basic URL', function () {
    const request = new Request('some-apikey', 'some-suiteId', 'https://somewhere.com', '{}')
    const service:any = new Service(request)
    assert.equal(service.getSuiteExecuteUrl(), 'https://api.ghostinspector.com/v1/suites/some-suiteId/execute/?apiKey=some-apikey')
  })

  it('should obscure the API key when obscureKey is true', function () {
    const request = new Request('some-apikey', 'some-suiteId', 'https://somewhere.com', '{}')
    const service:any = new Service(request)
    assert.equal(service.getSuiteExecuteUrl(true), 'https://api.ghostinspector.com/v1/suites/some-suiteId/execute/?apiKey=***')
  })

  it('should have appropriate post params', function () {
    const request = new Request('some-apikey', 'some-suiteId', 'https://somewhere.com', '{"browser": "chrome", "myVar": "hello"}')
    const service:any = new Service(request)
    assert.equal(service.body.browser, 'chrome', 'browser')
    assert.equal(service.body.myVar, 'hello', 'myVar')
    assert.equal(service.body.immediate, 1, 'immediate')
    assert.equal(service.body.startUrl, 'https://somewhere.com', 'startUrl')
  })

  it('should execute the request', async function () {
    let mockrequest = this.sandbox.stub(axios, 'post').callsFake(async function (): Promise<any> {
      return {data: {data: {_id: '1234'}, code: 'SUCCESS'}}
    })
    let mockpoll = this.sandbox.stub(Service.prototype, 'poll').callsFake(async function (): Promise<any> {
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

    let mockrequest:any = this.sandbox.stub(axios, 'get')
    mockrequest.onFirstCall().resolves(passingNull)
    mockrequest.onSecondCall().resolves(passingNull)
    mockrequest.onThirdCall().resolves(passingTrue)

    let mocksleep:any = this.sandbox.stub(Service.prototype, 'sleep')
    mocksleep.resolves()

    const request = new Request('some-apikey', 'some-suiteId', 'https://somewhere.com', '{"browser": "chrome", "myVar": "hello"}')
    const service = new Service(request)
    const result = await service.poll('1234')
    assert.ok(result === true)

    // clean up
    mockrequest.restore()
    mocksleep.restore()
  })

  it('should fail with execution error', async function () {
    const errorResponse = { data: { message: 'some error', code: 'ERROR'}}

    let mockrequest:any = this.sandbox.stub(axios, 'post')
    mockrequest.onFirstCall().resolves(errorResponse)

    let mocksleep:any = this.sandbox.stub(Service.prototype, 'sleep')
    mocksleep.resolves()

    const request = new Request('some-apikey', 'some-suiteId', 'https://somewhere.com', '{"browser": "chrome", "myVar": "hello"}')
    const service = new Service(request)
    const result = await service.execute()
    assert.ok(result === false)

    // clean up
    mockrequest.restore()
    mocksleep.restore()
  })

})
