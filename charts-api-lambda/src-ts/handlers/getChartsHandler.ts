import { type APIGatewayProxyEvent, type APIGatewayProxyResult } from 'aws-lambda';
import { ProcessEnvironment, processEnvironmentSchema } from '../ProcessEnvironment';
import { ChartEntityDAO } from '../entities/charts/dao/ChartEntityDAO';
import { ChartEntityDynamoDBDAO } from '../entities/charts/dao/ChartEntityDynamoDBDAO';
import { GetChartsRequestQueryStrings, getChartsRequestQueryStringsSchema } from '../entities/charts/models/GetChartsRequestQueryStrings';
import { GetChartsResponseBody } from '../entities/charts/models/GetChartsResponseBody';

export async function getChartsHandler (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  let processEnvironment: ProcessEnvironment
  processEnvironment = processEnvironmentSchema.parse(process.env)

  let queryStrings: GetChartsRequestQueryStrings
  try {
    queryStrings = getChartsRequestQueryStringsSchema.parse(event.queryStringParameters)
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
  const chartEntities = await chartEntityDAO.getCharts(queryStrings.ownerId)
  chartEntityDAO.disconnect()

  const responseBody: GetChartsResponseBody = {
    charts: chartEntities
  }

  return {
    statusCode: 200,
    body: JSON.stringify(responseBody)
  }
}