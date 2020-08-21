import BasePageHelper from './BasePageHelper'

export default class SettingsPageHelper extends BasePageHelper {
  constructor() {
    super('/settings', 'div#settings')
  }
}