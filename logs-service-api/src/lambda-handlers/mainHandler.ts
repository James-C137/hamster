import { type APIGatewayProxyEvent, type APIGatewayProxyResult } from 'aws-lambda'
import { getLogsHandler } from './getLogsHandler'
import { postLogHandler } from './postLogHandler'

type EventHandler = (event: APIGatewayProxyEvent) => Promise<APIGatewayProxyResult>

export async function mainHandler (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const handlers: Record<string, EventHandler> = {}
  handlers['GET /logs'] = getLogsHandler
  handlers['POST /logs'] = postLogHandler

  const key = `${event.httpMethod} ${event.resource}`
  const handler = handlers[key]

  if (handler === undefined) {
    throw new Error(`Unknown http resource ${key}`)
  }

  return await handler(event)
}
