import { type APIGatewayProxyEvent, type APIGatewayProxyResult } from 'aws-lambda'
import dotenv from 'dotenv'
import { Client } from 'pg'
import { PostLogsRequestBody, postLogsRequestBodySchema } from '../entities/logs/api-models/PutLogRequestBody'
import LogsEntityDAO from '../entities/logs/dao/LogsEntityDAO'
import { LogsEntityPostgresDAO } from '../entities/logs/dao/LogsEntityPostgresDAO'
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
  logsEntityDAO.postLogs(body)

  return {
    statusCode: 200,
    body: 'OK'
  }
}

async function putItemCommand (item: PostLogsRequestBody): Promise<void> {
  const postgresClient = new Client({
    host: process.env.HOST,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    port: parseInt(process.env.PORT!),
    database: process.env.DATABASE_NAME,
    user: process.env.USER,
    password: process.env.PASSWORD,
    ssl: true
  })

  await postgresClient.connect()
  await postgresClient.query(
    'INSERT INTO logs(username, analysisName, eventName, data) VALUES ' +
    `('${item.username}', '${item.analysisName ?? ''}', ` +
    `'${item.eventName ?? ''}', '${item.data ?? ''}')`
  )
  await postgresClient.end()
}
