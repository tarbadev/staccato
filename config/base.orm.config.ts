import path from 'path'
import { ConnectionOptions } from 'typeorm'

const entitiesPath = path.join(__dirname, '../server/src/infrastructure/**/*Entity.@(ts|js)')

const baseOptions: ConnectionOptions = {
  type: 'mysql',
  synchronize: true,
  dropSchema: false,
  migrationsRun: true,
  entities: [
    entitiesPath,
  ],
  cli: {
    'entitiesDir': entitiesPath,
  },
}
export default baseOptions