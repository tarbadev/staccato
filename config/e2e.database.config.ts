import localDbCredentials from './local.database.config'
import DbCredentials from '@shared/DbCredentials'

let credentials: DbCredentials
if (process.env.DB_CREDENTIALS) {
  const lines = process.env.DB_CREDENTIALS.split('\n')
  if (!lines[0].includes('{')) {
    lines.splice(0, 1)
  }
  credentials = JSON.parse(lines.join('\n'))
} else {
  credentials = localDbCredentials
}


export default credentials