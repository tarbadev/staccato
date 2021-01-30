import { createConnection, getConnection } from 'typeorm'
import { config as envDbCredentials } from '../config/env.database.config'
import localDbCredentials from '../config/local.database.config'

const connection = {
  async create() {
    await createConnection(envDbCredentials || localDbCredentials)
  },

  async close() {
    await getConnection().close()
  },

  async clear() {
    const conn = getConnection()
    const tables = [
      'resource_author',
      'author',
      'composer',
      'arranger',
      'instrument',
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