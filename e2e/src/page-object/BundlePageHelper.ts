import BasePageHelper from './BasePageHelper'

export default class BundlePageHelper extends BasePageHelper {
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

  async addImage(path: string) {
    await this.clickOnElement('[data-add-resource]')
    await this.clickOnElement('[data-add-image-resource]')

    const input = await this.getBySelector('[data-add-image-container] input[type="file"]')
    await input.uploadFile(path)

    await page.waitFor(1000)
    await this.clickOnElement('[data-button-submit]')
  }

  async getResources() {
    const resources = await page.$$('[data-resource-container]')
    resources.map(resource => {
      const type = resource.$eval('[data-resource-type]', element => element.textContent)
      const name = resource.$eval('[data-resource-name]', element => element.textContent)
      return { type, name }
    })
  }
}