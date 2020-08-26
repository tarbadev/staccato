import localDbCredentials from './local.database.config'

const config = localDbCredentials

if (process.env.DB_CREDENTIALS) {
  const lines = process.env.DB_CREDENTIALS.split('\n')
  if (!lines[0].includes('{')) {
    lines.splice(0, 1)
  }
  const credentials = JSON.parse(lines.join('\n'))
  config.host = credentials.hostname
  config.port = Number(credentials.port)
  config.username = credentials.username
  config.password = credentials.password
  config.database = credentials.name
}

export default config