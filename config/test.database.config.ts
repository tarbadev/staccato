import localDbCredentials from './local.database.config'

export const config = {
  ...localDbCredentials,
  'database': 'staccato_test',
}
export default config