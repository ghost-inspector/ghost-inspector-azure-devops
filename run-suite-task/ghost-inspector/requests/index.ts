
// TODO: type this?
type Params = {
  [key: string]: any
}

export class ExecuteSuiteRequest {
  apiKey:String = ''
  suiteId:string = ''
  startUrl:String = ''
  params:Params = {}
  
  constructor (apiKey:string, suiteId:string, startUrl='', rawParams:string|null ) {
    this.apiKey = apiKey
    this.suiteId = suiteId
    this.startUrl = startUrl
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
