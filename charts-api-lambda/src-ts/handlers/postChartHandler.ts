import { type APIGatewayProxyEvent, type APIGatewayProxyResult } from 'aws-lambda';
import { v4 as uuid } from 'uuid';
import { ProcessEnvironment, processEnvironmentSchema } from '../ProcessEnvironment';
import { ChartEntityDAO } from '../entities/charts/dao/ChartEntityDAO';
import { ChartEntityDynamoDBDAO } from '../entities/charts/dao/ChartEntityDynamoDBDAO';
import { PostChartRequestBody, postChartReqeustBodySchema } from '../entities/charts/models/PostChartRequestBody';
import { PostChartRequestQueryStrings, postChartRequestQueryStringsSchema } from '../entities/charts/models/PostChartRequestQueryStrings';

export async function postChartHandler (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  let processEnvironment: ProcessEnvironment
  processEnvironment = processEnvironmentSchema.parse(process.env)

  let queryStrings: PostChartRequestQueryStrings
  let requestBody: PostChartRequestBody
  try {
    queryStrings = postChartRequestQueryStringsSchema.parse(event.queryStringParameters)
    requestBody = postChartReqeustBodySchema.parse(JSON.parse(event.body ?? '{}'))
  } catch (e) {
    let message = 'Bad Request'
    if (e instanceof Error) {
      message = e.message
    }
    else if (typeof e === 'string') {
      message = e
    }
    return {
      statusCode: 400,
      body: message
    }
  }

  const chartEntityDAO: ChartEntityDAO = new ChartEntityDynamoDBDAO(processEnvironment.CHARTS_TABLE_NAME)
  chartEntityDAO.connect()
  await chartEntityDAO.postChart({
    ownerId: queryStrings.ownerId,
    chartId: uuid(),
    type: requestBody.type,
    queryType: requestBody.query,
    eventName: 'LOG_TIME'
  })
  chartEntityDAO.disconnect()

  return {
    statusCode: 200,
    body: 'OK'
  }
}

