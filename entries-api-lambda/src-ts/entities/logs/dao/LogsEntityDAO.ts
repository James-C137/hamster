import { LogEntity } from '../LogEntity';

export default interface LogsEntityDAO {
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  getLog: () => Promise<LogEntity>;
  postLogs: (entity: LogEntity) => Promise<boolean>;
};
