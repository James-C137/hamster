import { type APIGatewayProxyEvent, type APIGatewayProxyResult } from 'aws-lambda';
import ResponseUtils from '../../../lambda-utils/src-ts/ResponseUtils';
import { ChartEntityDatabase } from '../database-entities/charts/ChartEntityDatabase';

export async function deleteChartHandler (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const chartId = event.pathParameters?.chartId;
  if (!chartId) {
    return ResponseUtils.badRequest('Missing chartId in request path');
  }

  const ownerId = event.queryStringParameters?.ownerId;
  if (!ownerId) {
    return ResponseUtils.badRequest('Missing ownerId in query strings');
  }

  const chartEntityDatabase = new ChartEntityDatabase();
  await chartEntityDatabase.connect();
  await chartEntityDatabase.deleteChart(ownerId, chartId);
  await chartEntityDatabase.disconnect()

  return ResponseUtils.ok();
}
