import {ExecuteSuiteRequest} from '../requests'
import {Suite as SuiteService} from '../services'

export async function ExecuteSuite (request:ExecuteSuiteRequest) {
  const service = new SuiteService(request)
  const results = await service.execute()

  if (!results.length) {
    console.error('Execution failed, no results were returned.')
    return false
  }

  const resultIds = results.map((item) => item._id)
  console.log('Got suite results:', resultIds.join(', '))

  // poll for statuses
  const statuses = await Promise.all(resultIds.map((id) => service.poll(id)))

  // pull reports
  if (request.resultsPath) {
    try {
      await Promise.all(resultIds.map((id) => service.fetchAndWriteReport(id, request.resultsPath)))
    } catch (error) {
      console.error('Unable to save xUnit report:', error)
      return false
    }
  }

  return statuses.every(Boolean)
}
