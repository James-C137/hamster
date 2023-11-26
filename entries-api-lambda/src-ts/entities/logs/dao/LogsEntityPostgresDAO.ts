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
    console.log(`query: ${query}`)

    console.log('inside function')

    const test = await this.client.query(query)
    console.log('from await')
    console.log(test)

    /*
     command: 'SELECT',
  rowCount: 47,
  oid: null,
  rows: [
    {
      id: 25,
      ts: 2023-08-24T15:34:09.804Z,
      username: 'premelon',
      analysisname: '',
      eventname: 'energy',
      data: '3'
    },
    {
      id: 27,
      ts: 2023-08-24T17:57:19.354Z,
      username: 'premelon',
      analysisname: '',
      eventname: 'energy',
      data: 'hungry'
    },
    {
      id: 33,
      ts: 2023-08-24T20:35:10.078Z,
      username: 'premelon',
      analysisname: '',
      eventname: 'energy',
      data: '1'
    },
    {
      id: 34,
      ts: 2023-08-24T21:26:31.043Z,
      username: 'premelon',
      analysisname: '',
      eventname: 'energy',
      data: '3'
    },
  ]
  */

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
