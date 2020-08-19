import BasePage from './BasePage'

export default class BundlePage extends BasePage {
  constructor(id: number | string) {
    super(`/bundles/${id}`, 'div#bundle-detail')
  }

  getTitle(): Promise<string | null> {
    return this.getTextContentBySelector('[data-bundle-name]')
  }

  async editName(newName: string) {
    const editButtonSelector = '[data-edit-bundle-name]'
    const bundleNameSelector = '[data-new-bundle-name] input'
    const submitBundleSelector = '[data-submit-bundle]'

    await this.clickOnElement(editButtonSelector)
    await this.typeText(bundleNameSelector, newName)
    await this.clickOnElement(submitBundleSelector)
    await page.waitForSelector(`[data-bundle-name='${newName}']`)
  }
}