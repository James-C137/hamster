import { type APIGatewayProxyEvent, type APIGatewayProxyResult } from 'aws-lambda'
import type LogsEntityDAO from '../entities/logs/dao/LogsEntityDAO'
import { LogsEntityPostgresDAO } from '../entities/logs/dao/LogsEntityPostgresDAO'
import { logQuery } from '../entities/logs/postgres/QueryGenerator'


// test: https://7ieqxzxmqh.execute-api.us-east-1.amazonaws.com/prod/logs?queryType=LOG_TIME&username=premelon&eventname=energy
export async function getLogHandler (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const logsEntityDAO: LogsEntityDAO = new LogsEntityPostgresDAO()

  if (event.queryStringParameters == null) {
    return {
      statusCode: 500,
      body: 'No parameters defined'
    }
  } else if (event.queryStringParameters.queryType == null || event.queryStringParameters.username == null || event.queryStringParameters.eventname == null) {
    return {
      statusCode: 500,
      body: `Missing queryType, username, or eventname. queryStringParameters = ${JSON.stringify(event.queryStringParameters)}`
    }
  }

  await logsEntityDAO.connect()
  // TODO: Query
  const query = logQuery(
    event.queryStringParameters.queryType,
    event.queryStringParameters.username,
    event.queryStringParameters.eventname
  )
  console.log(`query: ${query}`);
  const logs = await logsEntityDAO.getLogs(query)

  await logsEntityDAO.disconnect()

  return {
    statusCode: 200,
    body: JSON.stringify(logs)
  }
}
