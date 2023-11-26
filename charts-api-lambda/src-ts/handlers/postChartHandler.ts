import { type APIGatewayProxyEvent, type APIGatewayProxyResult } from 'aws-lambda';

export async function postChartHandler (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  return {
    statusCode: 501,
    body: 'Not Implemented'
  }
}

