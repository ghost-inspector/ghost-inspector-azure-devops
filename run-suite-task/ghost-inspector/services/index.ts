import {ExecuteSuiteRequest} from '../requests'
import axios from 'axios'

export class Suite {

  suiteExecuteBaseUrl:string = 'https://api.ghostinspector.com/v1/suites'
  suiteResultsBaseUrl:string = 'https://api.ghostinspector.com/v1/suite-results'
  request:ExecuteSuiteRequest

  constructor (request:ExecuteSuiteRequest) {
    this.request = request
  }

  async sleep (time:number): Promise<any> {
    return new Promise(resolve => setTimeout(resolve, time))
  }

  getSuiteExecuteUrl (obscureKey:Boolean = false): string {
    const renderedKey = obscureKey ? '***' : this.request.apiKey
    return `${this.suiteExecuteBaseUrl}/${this.request.suiteId}/execute/?apiKey=${renderedKey}`
  }

  get body (): object {
    let params = this.request.params
    params.immediate = 1
    if (this.request.startUrl) {
      params.startUrl = this.request.startUrl
    }
    return params
  }

  async poll (suiteResultId:string): Promise<boolean> {
    const safeUrl = `${this.suiteResultsBaseUrl}/${suiteResultId}/?apiKey=`
    const resultsUrl = `${safeUrl}${this.request.apiKey}`
    await this.sleep(5000)

    console.log('Polling for suite results', `${safeUrl}***`)
    const results:any = await axios.get(resultsUrl)
    const status:boolean = results.data.data.passing

    if (status !== null) {
      console.log(`Got status, suiteResult ${suiteResultId} passing:`, status)
      return status
    } else {
      return this.poll(suiteResultId)
    }
  }

  async execute (): Promise<boolean> {
    console.log('POSTing execute request with body', this.getSuiteExecuteUrl(true), this.body)
    const response = await axios.post(this.getSuiteExecuteUrl(), this.body)
    const body = response.data
    if (body.code !== 'SUCCESS') {
      console.error(`Execution failed: ${body.message}`)
      return false
    }

    // prep single value response for polling
    if (!Array.isArray(body.data)) {
      body.data = [body.data]
    }

    body.data.forEach((item:any) => {
      console.log('Got suiteResultId', item._id)
    })

    const results = await Promise.all(body.data.map((item:any) => {
      return this.poll(item._id)
    }))

    return results.every(Boolean)
  }
}
