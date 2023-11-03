import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

type EventHandler = (event: APIGatewayProxyEvent) => Promise<APIGatewayProxyResult>

export async function handler (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  return {
    statusCode: 501,
    body: 'Not Implemented'
  }
}
