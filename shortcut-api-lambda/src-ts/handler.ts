import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { insertEntry } from './insertEntry';

type EventHandler = (event: APIGatewayProxyEvent) => Promise<APIGatewayProxyResult>;

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const handlers: {[key: string]: EventHandler} = {};
  handlers['POST /users/{userID}/entries'] = insertEntry;

  const key = `${event.httpMethod} ${event.resource}`;
  const handler = handlers[key];

  if (handler === undefined) {
    throw new Error(`Unknown http resource ${key}`);
  }

  return await handler(event);
}
