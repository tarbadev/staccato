import e2eDbCredentials from '@config/e2e.database.config'
import { ConnectionOptions, createConnection, getConnection } from 'typeorm'

export default {
  'database:createConnection'(): Promise<null> {
    return createConnection(e2eDbCredentials as ConnectionOptions)
      .then(() => null)
      .catch(err => {
        console.log('An error happened while connecting to DB', err.message)
        return null
      })
  },

  'database:closeConnection'(): Promise<null> {
    return getConnection().close()
      .then(() => null)
      .catch(err => {
        console.log('An error happened while closing the DB', err.message)
        return null
      })
  },

  async 'database:clear'(): Promise<null> {
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

    return null
  },

  'database:store'<T>({ entity, object }: { entity: string; object: T }): Promise<T | null> {
    return getConnection()
      .getRepository(entity)
      .save(object)
      .catch(err => {
        console.log('An error happened while storing the DB', err.message)
        return null
      })
  },
}