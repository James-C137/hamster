import { GetParameterCommand, SSMClient } from '@aws-sdk/client-ssm'
import { type APIGatewayProxyEvent, type APIGatewayProxyResult } from 'aws-lambda'
import axios from 'axios'
import { z } from 'zod'

const LOGS_API_URL = 'https://7ieqxzxmqh.execute-api.us-east-1.amazonaws.com/prod/logs'

const insertEntryBodySchema = z.object({
  username: z.string(),
  analysisName: z.string().optional(),
  eventName: z.string().optional(),
  data: z.string().optional()
})

export type InsertEntryBody = z.infer<typeof insertEntryBodySchema>

export async function insertEntry (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  let body: InsertEntryBody

  // Parse input from request
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

  // Pass through message to Entries API
  await axios.post(`${LOGS_API_URL}?ownerId=${body.username}&eventName=${body.eventName}`, {
    ts: Date.now(),
    username: body.username,
    analysisName: body.analysisName,
    eventName: body.eventName,
    data: body.data
  })

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'text/plain'
    },
    body: 'OK'
  }
}
