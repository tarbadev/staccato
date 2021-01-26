import path from 'path'
import { ConnectionOptions } from 'typeorm'

const serverPath = path.join(__dirname, '../server')
const entitiesPath = path.join(serverPath, 'src/infrastructure/**/*Entity.@(ts|js)')
const migrationsPath = path.join(serverPath, 'migrations')

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