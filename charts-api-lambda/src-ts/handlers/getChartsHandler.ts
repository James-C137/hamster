import { type APIGatewayProxyEvent, type APIGatewayProxyResult } from 'aws-lambda';
import { ProcessEnvironment, processEnvironmentSchema } from '../ProcessEnvironment';
import { ChartEntityDAO } from '../entities/charts/dao/ChartEntityDAO';
import { ChartEntityDynamoDBDAO } from '../entities/charts/dao/ChartEntityDynamoDBDAO';
import { GetChartsRequestQueryStrings, getChartsRequestQueryStringsSchema } from '../entities/charts/models/GetChartsRequestQueryStrings';
import { GetChartsResponseBody } from '../entities/charts/models/GetChartsResponseBody';
import { logQuery } from '../../../logs-api-lambda/src-ts/entities/logs/postgres/QueryGenerator'
import axios from 'axios'

const LOGS_API_URL = 'https://7ieqxzxmqh.execute-api.us-east-1.amazonaws.com/prod/logs'

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
  console.log('chartEntities');
  console.log(chartEntities);

  /*
  ownerId: string;
  chartId?: string;
  type?: ChartType;
  queryType?: string;
  eventName?: string
  */

  chartEntityDAO.disconnect()

  // test: https://7ieqxzxmqh.execute-api.us-east-1.amazonaws.com/prod/logs?queryType=LOG_TIME&username=premelon&eventname=energy

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
  

  return {
    statusCode: 200,
    body: JSON.stringify(chartEntitiesWithLogs)
  }
}