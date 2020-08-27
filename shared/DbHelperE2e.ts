import { createConnection, getConnection } from 'typeorm'
import e2eDbCredentials from '@config/e2e.database.config'
import { ConnectionOptions } from 'typeorm/connection/ConnectionOptions'

const connection = {
  async create() {
    await createConnection(e2eDbCredentials as ConnectionOptions)
  },

  async close() {
    await getConnection().close()
  },

  async clear() {
    const conn = getConnection()
    const tables = [
      'resource_author',
      'author',
      'resource',
      'bundle',
    ]

    for (const table of tables) {
      await conn.query(`DELETE FROM ${table}`)
    }
  },

  store(entity: string, object: any) {
    return getConnection().getRepository(entity).save(object)
  },
}
export default connection