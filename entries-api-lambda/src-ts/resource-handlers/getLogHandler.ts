import { type APIGatewayProxyEvent, type APIGatewayProxyResult } from 'aws-lambda'
import type LogsEntityDAO from '../entities/logs/dao/LogsEntityDAO'
import { LogsEntityPostgresDAO } from '../entities/logs/dao/LogsEntityPostgresDAO'

export async function getLogHandler (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const logsEntityDAO: LogsEntityDAO = new LogsEntityPostgresDAO()
  await logsEntityDAO.connect()
  // TODO: Query
  const query = "SELECT * FROM logs WHERE username = 'premelon' AND eventName = 'energy'"
  const logs = logsEntityDAO.getLog(query)

  await logsEntityDAO.disconnect()

  console.log('final output')
  console.log(logs)

  return {
    statusCode: 200,
    body: 'OK'
  }
}
