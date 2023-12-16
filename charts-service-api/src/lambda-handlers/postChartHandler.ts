import { type APIGatewayProxyEvent, type APIGatewayProxyResult } from 'aws-lambda';
import { request } from 'http';
import { v4 as uuid } from 'uuid';
import ResponseUtils from '../../../lambda-utils/src-ts/ResponseUtils';
import { PostChartRequestBody, postChartReqeustBodySchema } from '../api-schema/PostChartRequestBody';
import { PostChartRequestQueryStrings, postChartRequestQueryStringsSchema } from '../api-schema/PostChartRequestQueryStrings';
import { ChartEntityDatabase } from '../database-entities/charts/ChartEntityDatabase';

export async function postChartHandler (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  let queryStrings: PostChartRequestQueryStrings
  let requestBody: PostChartRequestBody
  try {
    queryStrings = postChartRequestQueryStringsSchema.parse(event.queryStringParameters)
    requestBody = postChartReqeustBodySchema.parse(JSON.parse(event.body ?? '{}'))
  } catch (e) {
    return ResponseUtils.badRequest(e);
  }

  console.log(`ownerId: ${queryStrings.ownerId}`)
  console.log(requestBody);

  const chartEntityDatabase: ChartEntityDatabase = new ChartEntityDatabase()
  chartEntityDatabase.connect()
  await chartEntityDatabase.postChart({
    ownerId: queryStrings.ownerId,
    chartId: uuid(),
    type: requestBody.type,
    queryType: requestBody.queryType,
    eventName: requestBody.eventName
  })
  chartEntityDatabase.disconnect()

  return ResponseUtils.ok();
}
