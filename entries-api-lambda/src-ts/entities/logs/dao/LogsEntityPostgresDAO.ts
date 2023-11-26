import { Client } from 'pg'
import { type LogEntity } from '../LogEntity'
import type LogsEntityDAO from './LogsEntityDAO'

export class LogsEntityPostgresDAO implements LogsEntityDAO {
  private readonly client: Client

  public constructor () {
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

  public async connect (): Promise<void> {
    await this.client.connect()
  }

  public async disconnect (): Promise<void> {
    await this.client.end()
  }

  public async getLog (query: string): Promise<LogEntity[]> {
    const result = await this.client.query(query)
    console.log('inside function')
    console.log(result)

    return [{
      username: '',
      eventName: '',
      data: ''
    }]
  };

  public async postLogs (entity: LogEntity): Promise<boolean> {
    await this.client.query(
      'INSERT INTO logs(username, analysisName, eventName, data) VALUES ' +
      `('${entity.username}', '${entity.analysisName ?? ''}', ` +
      `'${entity.eventName ?? ''}', '${entity.data ?? ''}')`
    )

    return true
  };
}
