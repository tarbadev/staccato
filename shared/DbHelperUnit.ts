import { createConnection, getConnection } from 'typeorm'
import testDbCredentials from '@config/test.database.config'
import { ConnectionOptions } from 'typeorm/connection/ConnectionOptions'

const connection = {
  async create() {
    await createConnection(testDbCredentials as ConnectionOptions)
  },

  async close() {
    await getConnection().close()
  },

  async clear() {
    const conn = getConnection()
    const tables = [
      'resource_author',
      'resource_composer',
      'resource_arranger',
      'resource_instrument',
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

  get(entity: string, id: number) {
    return getConnection().getRepository(entity).findOne(id)
  },

  getAllAuthors() {
    return getConnection().getRepository('AuthorEntity').find()
  },

  getAllComposers() {
    return getConnection().getRepository('ComposerEntity').find()
  },

  getAllArrangers() {
    return getConnection().getRepository('ArrangerEntity').find()
  },

  getAllInstruments() {
    return getConnection().getRepository('InstrumentEntity').find()
  },

  getAllResources() {
    return getConnection().getRepository('ResourceEntity').find()
  },
}
export default connection