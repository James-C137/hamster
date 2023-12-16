import { Client, QueryResult } from 'pg';
import { LogEntity } from '../LogEntity';
import LogsEntityDAO from './LogsEntityDAO';

export class LogsEntityPostgresDAO implements LogsEntityDAO {

  private client: Client;

  public constructor() {
    this.client = new Client({
      host: process.env.HOST,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      port: parseInt(process.env.PORT!),
      database: process.env.DATABASE_NAME,
      user: process.env.USER,
      password: process.env.PASSWORD,
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

  public async postLog(entity: LogEntity): Promise<boolean> {
    await this.client.query(
      'INSERT INTO logs(username, analysisName, eventName, data) VALUES ' +
      `('${entity.username}', '${entity.analysisName ?? ''}', ` +
      `'${entity.eventName ?? ''}', '${entity.data ?? ''}')`
    )

    return true;
  };
}
