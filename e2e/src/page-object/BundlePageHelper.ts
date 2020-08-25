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

  async addImage(path: string, title: string) {
    await this.clickOnElement('[data-add-resource]')
    await this.clickOnElement('[data-add-image-resource]')

    await this.typeText('[data-add-image-title] input', title)

    const input = await this.getBySelector('[data-add-image-container] input[type="file"]')
    await input.uploadFile(path)

    await page.waitFor(500)
    await this.clickOnElement('[data-button-submit]')

    await this.waitForTextByCss('[data-image-resource-title]', title)
  }

  async getResources() {
    const resources = []
    const resourceElements = await page.$$('[data-resource-container]')

    for (const resource of resourceElements) {
      const type = 'image'
      const title = await resource.$eval('[data-image-resource-title]', element => element.textContent)
      resources.push({ type, title })
    }

    return resources
  }
}