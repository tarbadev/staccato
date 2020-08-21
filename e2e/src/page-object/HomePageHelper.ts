import BasePageHelper from './BasePageHelper'

export default class HomePageHelper extends BasePageHelper {
  constructor() {
    super('/', 'div#home')
  }

  async getBundles(): Promise<{ name: string | null }[]> {
    return await page.$$eval(
      '[data-bundle-name]',
      elements => elements.map(el => ({ name: el.textContent })),
    )
  }

  async clickOnBundle(bundleName: string): Promise<void> {
    return this.clickOnElement(`[data-bundle-name='${bundleName}']`)
  }

  async addBundle(bundleName: string): Promise<void> {
    const addButtonSelector = '[data-add-bundle]'
    const bundleNameSelector = '[data-new-bundle-name] input'
    const submitBundleSelector = '[data-submit-bundle]'

    await this.clickOnElement(addButtonSelector)
    await this.typeText(bundleNameSelector, bundleName)
    await this.clickOnElement(submitBundleSelector)
    await page.waitForSelector(`[data-bundle-name='${bundleName}']`)
  }
}