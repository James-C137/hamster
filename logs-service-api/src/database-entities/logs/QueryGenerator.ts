import { QueryType } from './QueryType'

export function logQuery (queryType: QueryType, username: string, eventName: string): string {
  switch (queryType) {
    case 'LOG_TIME':
      return `SELECT * FROM logs WHERE username = '${username}' AND eventName = '${eventName}'`
    default:
      return `SELECT * FROM logs WHERE username = '${username}' AND eventName = '${eventName}'`
  }
}
