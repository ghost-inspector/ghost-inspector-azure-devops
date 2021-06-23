import axios from 'axios'
import fs from 'fs'

import {ExecuteSuiteRequest} from '../requests'

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

  async execute (): Promise<Array<any>>  {
    console.log('POSTing execute request with body', this.getSuiteExecuteUrl(true), this.body)
    const response = await axios.post(this.getSuiteExecuteUrl(), this.body)
    const body = response.data
    if (body.code !== 'SUCCESS') {
      console.error('Received error response: ', body.message)
      return []
    }

    // always return a list
    if (!Array.isArray(body.data)) {
      body.data = [body.data]
    }
    return body.data
  }

  async fetchAndWriteReport (id:string, destination:string): Promise<void> {
    console.log(`Fetching xUnit report for ${id}`)
    const reportUrl = `${this.suiteResultsBaseUrl}/${id}/xunit/?apiKey=${this.request.apiKey}`
    const report = (await axios.get(reportUrl)).data
    
    // write file
    await this.writeFile(`${destination}/${id}.xml`, report)
  }

  async writeFile(path:string, contents:string): Promise<void> {
    return fs.writeFileSync(path, contents)
  }
}
