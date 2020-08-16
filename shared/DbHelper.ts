import { createConnection, getConnection } from 'typeorm'
import ormAppConfig from '@config/orm.config.json'
import { ConnectionOptions } from 'typeorm/connection/ConnectionOptions'

const connection = {
  async create() {
    await createConnection(ormAppConfig as ConnectionOptions)
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