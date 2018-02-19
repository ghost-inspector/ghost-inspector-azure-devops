import {ExecuteSuiteRequest} from '../requests'
import {Suite as SuiteService} from '../services'

export async function ExecuteSuite (request:ExecuteSuiteRequest) {
  const executor = new SuiteService(request)
  return await executor.execute()
}
