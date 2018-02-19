import {ExecuteSuiteRequest} from '../requests'
import axios from 'axios'

export class Suite {

  suiteExecuteBaseUrl:string = 'https://api.ghostinspector.com/v1/suites'
  suiteResultsBaseUrl:string = 'https://api.ghostinspector.com/v1/suite-results'
  request:ExecuteSuiteRequest

  constructor (request:ExecuteSuiteRequest) {
    this.request = request
  }

  async sleep (time:Number): Promise<any> {
    return new Promise(resolve => setTimeout(resolve, time))
  }

  get suiteExecuteUrl (): string {
    return `${this.suiteExecuteBaseUrl}/${this.request.suiteId}/execute/?apiKey=${this.request.apiKey}`
  }

  get body (): object {
    let params = this.request.params
    params.immediate = 1
    return params
  }

  async poll (suiteResultId:string): Promise<boolean> {
    const resultsUrl = `${this.suiteResultsBaseUrl}/${suiteResultId}/?apiKey=${this.request.apiKey}`
    await this.sleep(5000)
    console.log('Polling for suite results', resultsUrl)
    const results:any = await axios.get(resultsUrl)
    const status:boolean = results.data.data.passing

    if (status !== null) {
      console.log('Got status, suite passing:', status)
      return status
    } else {
      return this.poll(suiteResultId)
    }
  }

  async execute (): Promise<boolean> {
    // TODO: test network failure
    console.log('POSTing execute request with body', this.suiteExecuteUrl, this.body)
    const response = await axios.post(this.suiteExecuteUrl, this.body)
    console.log('Got the resultId', response.data.data._id)
    const suiteResultId = response.data.data._id
    // TODO: what are the possible execute responses
    return await this.poll(suiteResultId)
  }
}
