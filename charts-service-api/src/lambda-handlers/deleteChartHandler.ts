import { type APIGatewayProxyEvent, type APIGatewayProxyResult } from 'aws-lambda';
import ResponseUtils from '../../../lambda-utils/src-ts/ResponseUtils';

export async function deleteChartHandler (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  return ResponseUtils.notImplemented();
}
