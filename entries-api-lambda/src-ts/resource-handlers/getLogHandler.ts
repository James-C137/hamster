import { type APIGatewayProxyEvent, type APIGatewayProxyResult } from 'aws-lambda';
import LogsEntityDAO from '../entities/logs/dao/LogsEntityDAO';
import { LogsEntityPostgresDAO } from '../entities/logs/dao/LogsEntityPostgresDAO';

export async function getLogHandler (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const logsEntityDAO: LogsEntityDAO = new LogsEntityPostgresDAO()
  logsEntityDAO.connect();
  // TODO: Query
  logsEntityDAO.disconnect();

  return {
    statusCode: 200,
    body: 'OK'
  }
}
