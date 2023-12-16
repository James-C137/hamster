import { Client, QueryResult } from 'pg';
import ProcessEnvUtils from '../../../../lambda-utils/src-ts/ProcessEnvUtils';
import { LogEntity } from './LogEntity';

export class LogsEntityDatabase {

  private client: Client;

  public constructor() {
    this.client = new Client({
      host: ProcessEnvUtils.getVar('DATABASE_HOST'),
      port: parseInt(ProcessEnvUtils.getVar('DATABASE_PORT')),
      database: ProcessEnvUtils.getVar('DATABASE_NAME'),
      user: ProcessEnvUtils.getVar('DATABASE_USER'),
      password: ProcessEnvUtils.getVar('DATABASE_PASSWORD'),
      ssl: true
    })
  }

  public async connect(): Promise<void> {
    await this.client.connect()
  }

  public async disconnect(): Promise<void> {
    await this.client.end()
  }

  public async getLogs(query: string): Promise<LogEntity[]> {
    const result: QueryResult = await this.client.query(query)

    return result.rows.map(row => {
      return {
        ts: row.ts,
        username: row.username,
        analysisName: row.analysisname,
        eventName: row.eventname,
        data: row.data
      }
    });
  };

  public async postLog(entity: LogEntity): Promise<void> {
    await this.client.query(
      'INSERT INTO logs(username, analysisName, eventName, data) VALUES ' +
      `('${entity.username}', '${entity.analysisName ?? ''}', ` +
      `'${entity.eventName ?? ''}', '${entity.data ?? ''}')`
    )
  };
}
