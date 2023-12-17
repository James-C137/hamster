import { type APIGatewayProxyEvent, type APIGatewayProxyResult } from 'aws-lambda';
import { v4 as uuid } from 'uuid';
import ResponseUtils from '../../../lambda-utils/src-ts/ResponseUtils';
import { PostChartRequestBody, PostChartRequestQueryStrings, postChartReqeustBodySchema, postChartRequestQueryStringsSchema } from '../api-schema/postChartsApiSchema';
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

  const chartEntityDatabase: ChartEntityDatabase = new ChartEntityDatabase()
  chartEntityDatabase.connect()
  await chartEntityDatabase.postChart({
    ownerId: queryStrings.ownerId,
    chartId: uuid(),
    chartType: requestBody.chartType,
    queryType: requestBody.queryType,
    eventName: requestBody.eventName
  })
  chartEntityDatabase.disconnect()

  return ResponseUtils.ok();
}
