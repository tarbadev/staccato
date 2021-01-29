import databasePlugin from './database.plugin'
import googleDrivePlugin from './googleDrive.plugin'
import PluginEvents = Cypress.PluginEvents
import ConfigOptions = Cypress.ConfigOptions

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on: PluginEvents, config: ConfigOptions): void | ConfigOptions | Promise<ConfigOptions> => {
  if (!config.env) {
    config.env = {}
  }

  config.env.DB_HOST = process.env.DB_HOST
  config.env.DB_PORT = process.env.DB_PORT
  config.env.DB_USERNAME = process.env.DB_USERNAME
  config.env.DB_PASSWORD = process.env.DB_PASSWORD
  config.env.DB_NAME = process.env.DB_NAME

  if (!config.env.APP_URL && process.env.APP_URL) {
    config.env.APP_URL = process.env.APP_URL
  }

  on('task', databasePlugin)
  on('task', googleDrivePlugin)

  return config
}
