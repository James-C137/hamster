import { GetParameterCommand, SSMClient } from '@aws-sdk/client-ssm'
import { type APIGatewayProxyEvent, type APIGatewayProxyResult } from 'aws-lambda'
import axios from 'axios'
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

  // Parse input from request
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

  // Pass through message to Entries API
  const entriesURL = await getEntriesURL()
  await axios.post(`${entriesURL}users/${body.username}/entries`, {
    timestamp: Date.now(),
    username: body.username,
    analysisName: body.analysisName,
    eventName: body.eventName,
    data: body.data
  })

  return {
    statusCode: 200,
    body: 'OK'
  }
}

async function getEntriesURL(): Promise<string> {
  const client = new SSMClient({ region: 'us-east-1' })
  const command = new GetParameterCommand({
    Name: 'HamsterEntriesBaseURL',
  })

  const output = await client.send(command)
  if (output.Parameter?.Value === undefined) {
    throw new Error('Failed to fetch Entries API Base URL')
  }

  return output.Parameter.Value
}
