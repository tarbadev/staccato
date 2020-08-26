import path from 'path'
import { ConnectionOptions } from 'typeorm'

const entitiesPath = path.join(__dirname, '../server/src/infrastructure/**/*Entity.@(ts|js)')
const migrationsPath = path.join(__dirname, '../server/migrations')

const baseOptions: ConnectionOptions = {
  type: 'mysql',
  synchronize: false,
  dropSchema: false,
  migrationsRun: true,
  entities: [
    entitiesPath,
  ],
  migrations: [`${migrationsPath}/*.@(ts|js)`],
  cli: {
    entitiesDir: entitiesPath,
    migrationsDir: 'migrations',
  },
}
export default baseOptions