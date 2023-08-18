import { type APIGatewayProxyEvent, type APIGatewayProxyResult } from 'aws-lambda'
import { z } from 'zod'
import { sendDiscordMessage } from './sendDiscordMessage'

const insertEntryBodySchema = z.object({
  username: z.string(),
  analysisName: z.string().optional(),
  eventName: z.string().optional(),
  data: z.string().optional()
})

export type InsertEntryBody = z.infer<typeof insertEntryBodySchema>

export async function insertEntry (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  let body: InsertEntryBody

  try {
    body = insertEntryBodySchema.parse(JSON.parse(event.body ?? ''))
    await sendDiscordMessage(body)
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

  return {
    statusCode: 200,
    body: 'OK'
  }
}
