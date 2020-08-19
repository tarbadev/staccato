import BasePage from './BasePage'

export default class HomePage extends BasePage {
  constructor() {
    super('/', 'div#home')
  }

  async getBundles() {
    return await page.$$eval(
      '[data-bundle-name]',
      elements => elements.map(el => ({ name: el.textContent })),
    )
  }

  async clickOnBundle(bundleName: string) {
    const bundle = await page.$(`[data-bundle-name='${bundleName}']`)

    if (bundle) {
      await bundle.click()
    } else {
      throw new Error(`Bundle not found: ${bundle}`)
    }
  }

  async addBundle(bundleName: string) {
    const addButtonSelector = '[data-add-bundle]'
    const bundleNameSelector = '[data-new-bundle-name] input'
    const submitBundleSelector = '[data-submit-bundle]'

    await this.clickOnElement(addButtonSelector)
    await this.typeText(bundleNameSelector, bundleName)
    await this.clickOnElement(submitBundleSelector)
    await page.waitForSelector(`[data-bundle-name='${bundleName}']`)
  }
}