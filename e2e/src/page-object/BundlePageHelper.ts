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

    const input = await this.getBySelector('[data-dropzone-container="image"] input[type="file"]')
    await input.uploadFile(path)

    await page.waitFor(500)
    await this.clickOnElement('[data-button-submit]')

    await this.waitForTextByCss('[data-resource-title]', title)
  }

  async getResources() {
    const resources = []
    const resourceElements = await page.$$('[data-resource-container]')

    for (const resource of resourceElements) {
      let type, title, source, authors
      if (await resource.$('img') !== null) {
        type = 'image'
        title = await this.getTextContentBySelector('[data-resource-title]')
      } else if (await resource.$('video') !== null) {
        const fullSource = await this.getTextContentBySelector('[data-resource-source]')
        const fullAuthors = await this.getTextContentBySelector('[data-resource-title] .MuiCardHeader-subheader')
        source = fullSource?.replace('Source: ', '')
        authors = fullAuthors?.split(', ')
        type = 'video'
        title = await this.getTextContentBySelector('[data-resource-title] .MuiCardHeader-title')
      }

      resources.push({ type, title, source, authors })
    }

    return resources
  }

  async addVideo(path: string, title: string, source: string, authors: string[]) {
    await this.clickOnElement('[data-add-resource]')
    await this.clickOnElement('[data-add-video-resource]')

    await this.typeText('[data-add-video-title] input', title)
    await this.typeText('[data-add-video-source] input', source)
    await this.typeText('[data-add-video-authors] input', authors.join(';'))

    const input = await this.getBySelector('[data-dropzone-container="video"] input[type="file"]')
    await input.uploadFile(path)

    await page.waitFor(500)
    await this.clickOnElement('[data-button-submit]')

    await this.waitForTextByCss('[data-resource-title]', title)
  }
}