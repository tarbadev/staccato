import path from 'path'

const entitiesPath = path.join(__dirname, '../server/src/infrastructure/**/*Entity.@(ts|js)')

export default {
  'type': 'mysql',
  'host': 'localhost',
  'port': 3306,
  'username': 'staccato',
  'password': '',
  'database': 'staccato',
  'synchronize': true,
  'entities': [
    entitiesPath,
  ],
  'cli': {
    'entitiesDir': entitiesPath,
  },
}