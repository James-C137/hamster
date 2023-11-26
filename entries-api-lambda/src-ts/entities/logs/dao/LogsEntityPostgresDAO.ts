import { Client } from 'pg';
import { LogEntity } from '../LogEntity';
import LogsEntityDAO from './LogsEntityDAO';

export class LogsEntityPostgresDAO implements LogsEntityDAO {

  private client: Client | undefined;

  public async connect(): Promise<void> {

  }

  public async disconnect(): Promise<void> {

  }

  public async getLog(): Promise<LogEntity> {
    const postgresClient = new Client({
      host: process.env.HOST,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      port: parseInt(process.env.PORT!),
      database: process.env.DATABASE_NAME,
      user: process.env.USER,
      password: process.env.PASSWORD,
      ssl: true
    })

    await postgresClient.connect()
    await postgresClient.query("")
    await postgresClient.end()

    return {
      username: ''
    };
  };

  public async postLogs(entity: LogEntity): Promise<boolean> {
    const postgresClient = new Client({
      host: process.env.HOST,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      port: parseInt(process.env.PORT!),
      database: process.env.DATABASE_NAME,
      user: process.env.USER,
      password: process.env.PASSWORD,
      ssl: true
    })

    await postgresClient.connect()
    await postgresClient.query(
      'INSERT INTO logs(username, analysisName, eventName, data) VALUES ' +
      `('${entity.username}', '${entity.analysisName ?? ''}', ` +
      `'${entity.eventName ?? ''}', '${entity.data ?? ''}')`
    )
    await postgresClient.end()

    return true;
  };
}
