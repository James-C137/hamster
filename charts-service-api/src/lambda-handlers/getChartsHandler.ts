import { type APIGatewayProxyEvent, type APIGatewayProxyResult } from 'aws-lambda';
import axios from 'axios';
import ResponseUtils from '../../../lambda-utils/src-ts/ResponseUtils';
import { getLogsResponseBodySchema } from '../../../logs-service-api/src/api-schema/getLogsApiSchema';
import { ChartWithLogs, GetChartsRequestQueryStrings, chartWithLogsSchema, getChartsRequestQueryStringsSchema, getChartsResponseBodySchema } from '../api-schema/getChartsApiSchema';
import { ChartEntity } from '../database-entities/charts/ChartEntity';
import { ChartEntityDatabase } from '../database-entities/charts/ChartEntityDatabase';

const LOGS_API_URL = 'https://7ieqxzxmqh.execute-api.us-east-1.amazonaws.com/prod/logs'

export async function getChartsHandler (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  let queryStrings: GetChartsRequestQueryStrings
  try {
    queryStrings = getChartsRequestQueryStringsSchema.parse(event.queryStringParameters)
  } catch (e) {
    return ResponseUtils.badRequest(e);
  }

  const chartEntityDatabase = new ChartEntityDatabase()
  await chartEntityDatabase.connect()
  const chartEntities = await chartEntityDatabase.getCharts(queryStrings.ownerId)
  await chartEntityDatabase.disconnect()

  const chartsWithLogs = (await Promise.all(chartEntities.map(enrichChartWithLogs))).filter(e => e !== null);
  const responseBody = getChartsResponseBodySchema.parse({charts: chartsWithLogs});
  return ResponseUtils.ok(responseBody);
}

async function enrichChartWithLogs(chartEntity: ChartEntity): Promise<ChartWithLogs | null> {
  try {
    const response = await axios.get(`${LOGS_API_URL}?ownerId=${chartEntity.ownerId}&eventName=${chartEntity.eventName}&queryType=${chartEntity.queryType}`);
    const logs = getLogsResponseBodySchema.parse(response.data);
    return chartWithLogsSchema.parse({...chartEntity, logs});
  } catch (error) {
    console.error('Error fetching data for chart entity', chartEntity, error);
    return null;
  }
}
