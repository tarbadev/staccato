import path from 'path'

const entitiesPath = path.join(__dirname, '../server/src/infrastructure/**/*Entity.@(ts|js)')

export default {
  'type': 'mysql',
  'synchronize': true,
  'entities': [
    entitiesPath,
  ],
  'cli': {
    'entitiesDir': entitiesPath,
  },
}