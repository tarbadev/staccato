import BasePageHelper from './BasePageHelper'

export default class SettingsPageHelper extends BasePageHelper {
  constructor() {
    super('/settings', 'div#settings')
  }

  async getAuthorizedUsers(): Promise<{ name: string | null }[]> {
    await page.waitForSelector('[data-authorized-user')
    return this.getAllSelectorTextContent('[data-authorized-user]')
  }

  async addAuthorizedUser(email: string): Promise<void> {
    const addButtonSelector = '[data-add-express]'
    const userEmailSelector = '[data-new-express-name] input'
    const submitBundleSelector = '[data-submit-express]'

    await this.clickOnElement(addButtonSelector)
    await this.typeText(userEmailSelector, email)
    await this.clickOnElement(submitBundleSelector)
    await page.waitForSelector(`[data-authorized-user='${email}']`)
  }
}