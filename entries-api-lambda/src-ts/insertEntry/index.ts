import { type APIGatewayProxyEvent, type APIGatewayProxyResult } from 'aws-lambda'
import { Client } from 'pg'
import { z } from 'zod'
import dotenv from 'dotenv'
dotenv.config()

const insertEntryBodySchema = z.object({
  timestamp: z.coerce.date(),
  username: z.string(),
  analysisName: z.string().optional(),
  eventName: z.string().optional(),
  data: z.string().optional()
})

type InsertEntryBody = z.infer<typeof insertEntryBodySchema>

export async function insertEntry (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  let body: InsertEntryBody
  try {
    body = insertEntryBodySchema.parse(JSON.parse(event.body ?? ''))
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

  await putItemCommand(body)

  return {
    statusCode: 200,
    body: 'OK'
  }
}

async function putItemCommand (item: InsertEntryBody): Promise<void> {
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
