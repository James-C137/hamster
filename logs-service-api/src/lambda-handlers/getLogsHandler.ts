import { type APIGatewayProxyEvent, type APIGatewayProxyResult } from 'aws-lambda'
import ResponseUtils from '../../../lambda-utils/src-ts/ResponseUtils'
import { GetLogsQueryStringParameters, GetLogsResponseBody, getLogsQueryStringParametersSchema } from '../api-schema/getLogsApiSchema'
import { LogsEntityDatabase } from '../database-entities/logs/LogsEntityDatabase'
import { logQuery } from '../database-entities/logs/QueryGenerator'

export async function getLogsHandler (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  let queryStringParameters: GetLogsQueryStringParameters;
  try {
    queryStringParameters = getLogsQueryStringParametersSchema.parse(event.queryStringParameters);
  }
  catch (e) {
    return ResponseUtils.badRequest(e);
  }

  const logsEntityDatabase = new LogsEntityDatabase()
  await logsEntityDatabase.connect()
  const query = logQuery(
    queryStringParameters.queryType,
    queryStringParameters.ownerId,
    queryStringParameters.eventName
  )
  console.log(`query: ${query}`);
  const logs = await logsEntityDatabase.getLogs(query)
  console.log('logs');
  console.log(logs);
  await logsEntityDatabase.disconnect()

  const responseBody: GetLogsResponseBody = {
    eventName: queryStringParameters.eventName,
    data: logs.map(log => [log.ts, log.data])
  }

  return ResponseUtils.ok(responseBody);
}
