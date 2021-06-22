import * as assert from 'assert'
import {} from 'mocha'
import * as sinon from 'sinon'

import {ExecuteSuiteRequest as Request} from '../ghost-inspector/requests'
import {ExecuteSuite} from '../ghost-inspector/use-cases'
import {Suite as SuiteService} from '../ghost-inspector/services'

describe.only('use-cases.ExecuteSuite', function () {
  beforeEach(function () {
    this.sandbox = sinon.createSandbox()
  })

  afterEach(function () {
    this.sandbox.restore()
  })

  it('should return false if no results returned', async function () {
    const serviceStub = this.sandbox.stub(SuiteService.prototype, 'execute').resolves([])
    const request = new Request('some-apikey', 'some-suiteId', 'https://somewhere.com', '{}')

    const result = await ExecuteSuite(request)
    assert.ok(result === false)
  })

  it('should execute and poll when multiple suite results (executed with data source)', async function () {
    const passingNull = { _id: '1234', passing: null }
    const passingTrue = { _id: '1235', passing: true }

    // mock out execution
    this.sandbox.stub(SuiteService.prototype, 'execute').resolves([passingNull, passingTrue])

    // polling always returns true
    const mockpoll = this.sandbox.stub(SuiteService.prototype, 'poll')
    mockpoll.resolves(true)

    const request = new Request('some-apikey', 'some-suiteId', 'https://somewhere.com', '{"browser": "chrome", "myVar": "hello"}')
    const result = await ExecuteSuite(request)

    assert.equal(mockpoll.callCount, 2)
    assert.deepEqual(mockpoll.args[0], ['1234'])
    assert.deepEqual(mockpoll.args[1], ['1235'])
    assert.ok(result)
  })

  it('should fail with multiple results when one returns passing=false', async function () {
    const passingNull = { _id: '1234', passing: null }
    const passingTrue = { _id: '1235', passing: true }

    // mock out execution
    this.sandbox.stub(SuiteService.prototype, 'execute').resolves([passingNull, passingTrue])

    const mockpoll = this.sandbox.stub(SuiteService.prototype, 'poll')
    mockpoll.onFirstCall().resolves(true)
    mockpoll.onSecondCall().resolves(false)

    const request = new Request('some-apikey', 'some-suiteId', 'https://somewhere.com', '{"browser": "chrome", "myVar": "hello"}')
    const result = await ExecuteSuite(request)

    assert.equal(result, false)
  })

  it('should write results when resultsPath specified', async function () {
    const passingNull = { _id: '1234', passing: null }
    const passingTrue = { _id: '1235', passing: true }

    // mock out execution
    this.sandbox.stub(SuiteService.prototype, 'execute').resolves([passingNull, passingTrue])
    const reportStub = this.sandbox.stub(SuiteService.prototype, 'fetchAndWriteReport').resolves()

    // polling always returns true
    this.sandbox.stub(SuiteService.prototype, 'poll').resolves(true)

    const request = new Request('some-apikey', 'some-suiteId', 'https://somewhere.com', '{"browser": "chrome", "myVar": "hello"}', '/some/path')
    const result = await ExecuteSuite(request)

    assert.equal(result, true)

    assert.equal(reportStub.callCount, 2)
    assert.deepEqual(reportStub.args[0], ['1234', '/some/path'])
    assert.deepEqual(reportStub.args[1], ['1235', '/some/path'])
  })

  it('should return false when report cannot be written', async function () {
    const passingNull = { _id: '1234', passing: null }
    const passingTrue = { _id: '1235', passing: true }

    // mock out execution
    this.sandbox.stub(SuiteService.prototype, 'execute').resolves([passingNull, passingTrue])
    const reportStub = this.sandbox.stub(SuiteService.prototype, 'fetchAndWriteReport').rejects(new Error('some error'))

    // polling always returns true
    this.sandbox.stub(SuiteService.prototype, 'poll').resolves(true)

    const request = new Request('some-apikey', 'some-suiteId', 'https://somewhere.com', '{"browser": "chrome", "myVar": "hello"}', '/some/path')
    const result = await ExecuteSuite(request)

    assert.equal(result, false)
  })
})