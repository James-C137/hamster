import { type APIGatewayProxyEvent, type APIGatewayProxyResult } from 'aws-lambda'
import { deleteChartHandler } from './deleteChartHandler'
import { getChartsHandler } from './getChartsHandler'
import { postChartHandler } from './postChartHandler'

type EventHandler = (event: APIGatewayProxyEvent) => Promise<APIGatewayProxyResult>

export async function mainHandler (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const handlers: Record<string, EventHandler> = {}
  handlers['GET /charts'] = getChartsHandler
  handlers['POST /charts'] = postChartHandler
  handlers['DELETE /charts/{chartId}'] = deleteChartHandler

  const key = `${event.httpMethod} ${event.resource}`
  const handler = handlers[key]

  if (handler === undefined) {
    throw new Error(`Unknown http resource ${key}`)
  }

  return await handler(event)
}
