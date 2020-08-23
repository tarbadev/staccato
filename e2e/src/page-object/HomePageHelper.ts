import BasePageHelper from './BasePageHelper'

export default class HomePageHelper extends BasePageHelper {
  constructor() {
    super('/', 'div#home')
  }

  getBundles(): Promise<{ name: string | null }[]> {
    return this.getAllSelectorTextContent('[data-bundle-name]')
  }

  async clickOnBundle(bundleName: string): Promise<void> {
    return this.clickOnElement(`[data-bundle-name='${bundleName}']`)
  }

  async addBundle(bundleName: string): Promise<void> {
    const addButtonSelector = '[data-add-express]'
    const bundleNameSelector = '[data-new-express-name] input'
    const submitBundleSelector = '[data-submit-express]'

    await this.clickOnElement(addButtonSelector)
    await this.typeText(bundleNameSelector, bundleName)
    await this.clickOnElement(submitBundleSelector)
    await page.waitForSelector(`[data-bundle-name='${bundleName}']`)
  }
}