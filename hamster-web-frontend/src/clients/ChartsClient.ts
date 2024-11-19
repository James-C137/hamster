import axios from 'axios';
import { ChartWithLogs, getChartsResponseBodySchema } from '../../../charts-service-api/src/api-schema/getChartsApiSchema';
import { PostChartRequestBody, PostChartRequestQueryStrings } from '../../../charts-service-api/src/api-schema/postChartsApiSchema';

export class ChartsClient {

  private static API_BASE_URL = 'https://qiqp6ejx2c.execute-api.us-east-1.amazonaws.com/prod';

  static async postChart(queryStrings: PostChartRequestQueryStrings, requestBody: PostChartRequestBody ) {
    
  }

  static async getCharts(ownerId: string): Promise<ChartWithLogs[]> {
    const response = await axios.get(`${this.API_BASE_URL}/charts?ownerId=${ownerId}`);
    const responseBody = getChartsResponseBodySchema.parse(response.data);
    const x = responseBody.charts;
    return responseBody.charts;
  }

  static async deleteChart() {
    throw new Error('Unsupported operation');
  }
}
