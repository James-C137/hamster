import { type APIGatewayProxyEvent, type APIGatewayProxyResult } from 'aws-lambda'
import dotenv from 'dotenv'
import ResponseUtils from '../../../lambda-utils/src-ts/ResponseUtils'
import { PostLogsRequestBody, PostLogsRequestQueryStringParameters, postLogsRequestBodySchema, postLogsRequestQueryStringParametersSchema } from '../api-schema/postLogApiSchema'
import { LogEntity } from '../database-entities/logs/LogEntity'
import { LogsEntityDatabase } from '../database-entities/logs/LogsEntityDatabase'
dotenv.config()

export async function postLogHandler (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  let queryStringParameters: PostLogsRequestQueryStringParameters;
  let body: PostLogsRequestBody;
  try {
    queryStringParameters = postLogsRequestQueryStringParametersSchema.parse(event.queryStringParameters);
    body = postLogsRequestBodySchema.parse(JSON.parse(event.body ?? '{}'));
  } catch (e) {
    return ResponseUtils.badRequest(e);
  }

  const logEntity: LogEntity = {
    ts: new Date().toJSON(),
    username: queryStringParameters.ownerId,
    eventName: queryStringParameters.eventName,
    data: body.data
  }

  const logsEntityDatabase = new LogsEntityDatabase()
  await logsEntityDatabase.connect()
  await logsEntityDatabase.postLog(logEntity)
  await logsEntityDatabase.disconnect()

  return ResponseUtils.ok();
}
