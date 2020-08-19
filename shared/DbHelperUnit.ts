import { createConnection, getConnection } from 'typeorm'
import ormAppConfig from '@config/base.orm.config'
import localDbCredentials from '@config/local.database.config'
import testDbCredentials from '@config/test.database.config.ts'
import { ConnectionOptions } from 'typeorm/connection/ConnectionOptions'

const connection = {
  async create() {
    const dbConfig = {
      ...ormAppConfig,
      ...localDbCredentials,
      ...testDbCredentials,
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

  get(entity: string, id: number) {
    return getConnection().getRepository(entity).findOne(id)
  },
}
export default connection