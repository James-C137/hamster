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
    let dataToInsert: string | string[] = entity.data; // Default to the string itself

    try {
      const parsedData = JSON.parse(entity.data);
      if (Array.isArray(parsedData)) {
        dataToInsert = parsedData;
      }
    } catch (e) {
      // Not a valid JSON string, or not an array. Treat as a single string entry.
      // console.log('Data is not a stringified array, treating as single entry:', entity.data);
    }

    if (Array.isArray(dataToInsert)) {
      const values = dataToInsert.map((d: any) =>
        `('${entity.username}', '${entity.analysisName ?? ''}', '${entity.eventName ?? ''}', '${d ?? ''}')`
      ).join(', ');
      await this.client.query(
        `INSERT INTO logs(username, analysisName, eventName, data) VALUES ${values}`
      );
    } else {
      // dataToInsert is a string here
      await this.client.query(
        'INSERT INTO logs(username, analysisName, eventName, data) VALUES ' +
        `('${entity.username}', '${entity.analysisName ?? ''}', ` +
        `'${entity.eventName ?? ''}', '${dataToInsert ?? ''}')`
      )
    }
  };
}
