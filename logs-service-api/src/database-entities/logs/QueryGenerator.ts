export function logQuery (queryType: string, username: string, eventName: string): string {
  switch (queryType) {
    case 'LOG_TIME':
      return `SELECT * FROM logs WHERE username = '${username}' AND eventName = '${eventName}'`
    default:
      return `SELECT * FROM logs WHERE username = '${username}' AND eventName = '${eventName}'`
  }
}
