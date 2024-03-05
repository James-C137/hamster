import { QueryType } from './QueryType'

export function logQuery (queryType: QueryType, username: string, eventName: string): string {
  switch (queryType) {
    case 'LOG_TIME':
      return `SELECT * FROM logs WHERE username = '${username}' AND eventName = '${eventName}' AND ts > CURRENT_TIMESTAMP - INTERVAL '90 days' LIMIT 1000000`
    case 'QUANTITY':
      return `SELECT * FROM logs WHERE username = '${username}' AND eventName = '${eventName}' AND ts > CURRENT_TIMESTAMP - INTERVAL '90 days' LIMIT 1000000`
    default:
      return `SELECT * FROM logs WHERE username = '${username}' AND eventName = '${eventName}' AND ts > CURRENT_TIMESTAMP - INTERVAL '90 days' LIMIT 1000000`
  }
}
