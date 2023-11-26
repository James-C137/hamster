import { type LogEntity } from '../LogEntity'

export default interface LogsEntityDAO {
  connect: () => Promise<void>
  disconnect: () => Promise<void>
  getLog: (query: string) => Promise<LogEntity[]>
  postLogs: (entity: LogEntity) => Promise<boolean>
};
