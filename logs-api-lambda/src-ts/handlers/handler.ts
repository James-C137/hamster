import { type APIGatewayProxyEvent, type APIGatewayProxyResult } from 'aws-lambda'
import { getLogHandler } from './getLogHandler'
import { insertEntry } from './insertEntry'
import { ping } from './ping'

type EventHandler = (event: APIGatewayProxyEvent) => Promise<APIGatewayProxyResult>

export async function handler (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const handlers: Record<string, EventHandler> = {}
  handlers['GET /ping'] = ping
  handlers['GET /logs'] = getLogHandler
  handlers['POST /logs'] = insertEntry

  const key = `${event.httpMethod} ${event.resource}`
  const handler = handlers[key]

  if (handler === undefined) {
    throw new Error(`Unknown http resource ${key}`)
  }

  return await handler(event)
}
