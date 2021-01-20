import baseOrmConfig from './base.orm.config'
import { ConnectionOptions } from 'typeorm'

let config: ConnectionOptions

if (process.env.DB_HOST
  && process.env.DB_PORT
  && process.env.DB_USERNAME
  && process.env.DB_PASSWORD
  && process.env.DB_NAME) {
  config = {
    ...baseOrmConfig,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  } as ConnectionOptions
}

export { config }