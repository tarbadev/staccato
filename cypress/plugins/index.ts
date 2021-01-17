import databasePlugin from './database.plugin'
import PluginEvents = Cypress.PluginEvents
import ConfigOptions = Cypress.ConfigOptions

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on: PluginEvents): void | ConfigOptions | Promise<ConfigOptions> => {
  on('task', databasePlugin)
}
