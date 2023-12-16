import { type APIGatewayProxyEvent, type APIGatewayProxyResult } from 'aws-lambda';
import axios from 'axios';
import ResponseUtils from '../../../lambda-utils/src-ts/ResponseUtils';
import { GetChartsRequestQueryStrings, getChartsRequestQueryStringsSchema } from '../api-schema/GetChartsRequestQueryStrings';
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
  chartEntityDatabase.connect()
  const chartEntities = await chartEntityDatabase.getCharts(queryStrings.ownerId)
  chartEntityDatabase.disconnect()

  const chartEntitiesWithLogs = await Promise.all(chartEntities.map(async (chartEntity) => {
    try {
          const response = await axios.get(
              `${LOGS_API_URL}?queryType=${chartEntity.queryType}&username=${chartEntity.ownerId}&eventname=${chartEntity.eventName}`
          );
          return {
            ...chartEntity,
            rows: response.data.map((row: { data: any; }) => row.data)
          }
      } catch (error) {
          console.error('Error fetching data for chart entity:', error);
          return null;
      }
  }));

  console.log('chartEntitiesWithLogs');
  console.log(chartEntitiesWithLogs);

  // what's remaining
  /*
   * 1. change GetChartsResponseBody to use a new type that contains info necessary for the frontend
     2. add code in here to convert each queryType into a query and run it against logs API
     3. compile that into one object and return it to frontend
    */
  
  return ResponseUtils.ok(chartEntitiesWithLogs);
}
