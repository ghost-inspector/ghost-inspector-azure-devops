import * as task from 'vsts-task-lib/task'
import {ExecuteSuite, ExecuteSuiteRequest as Request} from './ghost-inspector'

async function main() {
  try {
    const result:boolean = await ExecuteSuite(new Request(
      task.getInput('apikey', true),
      task.getInput('suiteid', true),
      task.getInput('starturl', false),
      task.getInput('parameters', false),
      task.getInput('resultspath', false)
    ))

    if (result) {
      task.setResult(task.TaskResult.Succeeded, '')
    } else {
      task.setResult(task.TaskResult.Failed, 'Suite failed.')
    }

  } catch (error) {
    console.error(`Task failed with an error: ${error}`)
    task.setResult(task.TaskResult.Failed, `${error}`)
  }
}

main()
