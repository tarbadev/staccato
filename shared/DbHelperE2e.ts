import { createConnection, getConnection } from 'typeorm'
import baseOrmConfig from '@config/base.orm.config'
import e2eDbCredentials from '@config/e2e.database.config'
import { ConnectionOptions } from 'typeorm/connection/ConnectionOptions'

const connection = {
  async create() {
    const dbConfig = {
      ...baseOrmConfig,
      ...e2eDbCredentials,
      database: e2eDbCredentials.name,
      host: e2eDbCredentials.hostname,
      name: 'default',
    }

    await createConnection(dbConfig as ConnectionOptions)
  },

  async close() {
    await getConnection().close()
  },

  async clear() {
    const conn = getConnection()
    const entities = getConnection().entityMetadatas

    for (const entity of entities) {
      const repository = conn.getRepository(entity.name)
      await repository.query(`DELETE FROM ${entity.tableName}`)
    }
  },

  store(entity: string, object: any) {
    return getConnection().getRepository(entity).save(object)
  },
}
export default connection