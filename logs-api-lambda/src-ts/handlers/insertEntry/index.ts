import { type APIGatewayProxyEvent, type APIGatewayProxyResult } from 'aws-lambda'
import dotenv from 'dotenv'
import { PostLogsRequestBody, postLogsRequestBodySchema } from '../../entities/logs/api-models/PutLogRequestBody'
import LogsEntityDAO from '../../entities/logs/dao/LogsEntityDAO'
import { LogsEntityPostgresDAO } from '../../entities/logs/dao/LogsEntityPostgresDAO'
dotenv.config()

export async function insertEntry (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  let body: PostLogsRequestBody
  try {
    body = postLogsRequestBodySchema.parse(JSON.parse(event.body ?? ''))
  } catch (e) {
    let message: string = 'Bad Request'
    if (e instanceof Error) {
      message = e.message
    } else if (typeof e === 'string') {
      message = e
    }
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'text/plain'
      },
      body: message
    }
  }

  const logsEntityDAO: LogsEntityDAO = new LogsEntityPostgresDAO()
  logsEntityDAO.connect()
  logsEntityDAO.postLogs(body)
  logsEntityDAO.disconnect()

  return {
    statusCode: 200,
    body: 'OK'
  }
}
