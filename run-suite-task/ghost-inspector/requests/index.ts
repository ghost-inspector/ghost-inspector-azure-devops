
// TODO: type this?
type Params = {
  [key: string]: any
}

export class ExecuteSuiteRequest {
  apiKey:string = ''
  suiteId:string = ''
  startUrl:string = ''
  params:Params = {}
  resultsPath:string = ''
  
  constructor (apiKey:string, suiteId:string, startUrl='', rawParams:string|null, resultsPath='' ) {
    this.apiKey = apiKey
    this.suiteId = suiteId
    this.startUrl = startUrl
    this.resultsPath = resultsPath
    try {
      if (rawParams) {
        this.params = JSON.parse(rawParams)
      } else {
        this.params = {}
      }
    } catch (error) {
      throw new Error('Params must be JSON-decodable.')
    }
  }
}
