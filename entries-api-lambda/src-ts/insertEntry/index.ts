import { type AttributeValue, DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb'
import { type APIGatewayProxyEvent, type APIGatewayProxyResult } from 'aws-lambda'
import { z } from 'zod'

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
  const client = new DynamoDBClient({ region: process.env.REGION })
  const dynamoDBItem: Record<string, AttributeValue> = {
    username: { S: item.username },
    timestamp: { S: item.timestamp.toJSON() }
  }
  if (item.analysisName) dynamoDBItem.analysisName = { S: item.analysisName }
  if (item.eventName) dynamoDBItem.eventName = { S: item.eventName }
  if (item.data) dynamoDBItem.data = { S: item.data }
  const command = new PutItemCommand({
    TableName: process.env.ENTRIES_TABLE_NAME,
    Item: dynamoDBItem
  })
  await client.send(command)
}
