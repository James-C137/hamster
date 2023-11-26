import { type LogEntity } from '../LogEntity'

export default interface LogsEntityDAO {
  connect: () => Promise<void>
  disconnect: () => Promise<void>
  getLogs: (query: string) => Promise<LogEntity[]>
  postLog: (entity: LogEntity) => Promise<boolean>
};
