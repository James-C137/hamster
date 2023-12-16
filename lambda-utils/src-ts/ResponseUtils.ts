import { type APIGatewayProxyResult } from 'aws-lambda';

export default class ResponseUtils {

  public static ok(body?: unknown): APIGatewayProxyResult {
    return this.createResponse(200, 'OK', body);
  }

  public static badRequest(body?: unknown): APIGatewayProxyResult {
    return this.createResponse(400, 'Bad Request', body);
  }

  private static createResponse(statusCode: number, defaultBody: string, body: unknown): APIGatewayProxyResult {
    let currentBody: string = defaultBody;
    let contentType = 'text/plain';

    if (body instanceof Error) currentBody = body.message;
    if (typeof body === 'string') currentBody = body;
    if (typeof body === 'object' && body) {
      currentBody = JSON.stringify(body);
      contentType = 'application/json'
    }

    return {
      statusCode,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': contentType
      },
      body: currentBody
    }
  }
}
