import { type APIGatewayProxyEvent, type APIGatewayProxyResult } from 'aws-lambda'

export async function ping (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'text/plain'
    },
    body: 'Pong'
  }
}
