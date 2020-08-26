import baseOrmConfig from './base.orm.config'

export const config = {
  ...baseOrmConfig,
  'host': 'localhost',
  'port': 3306,
  'username': 'staccato',
  'password': 'staccato',
  'database': 'staccato',
}
export default config
module.exports = config