import BasePageHelper from './BasePageHelper'
import { AudioType } from '@shared/Resource'

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
      let type, title, source, authors, audioType, album
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
      } else if (await resource.$('audio') !== null) {
        const fullType = await this.getTextContentBySelector('[data-music-resource-type]')
        const fullAuthors = await this.getTextContentBySelector('[data-resource-title] .MuiCardHeader-subheader')
        const fullTitle = await this.getTextContentBySelector('[data-resource-title] .MuiCardHeader-title')
        audioType = fullType?.replace('Type: ', '')
        authors = fullAuthors?.split(', ')
        type = 'audio'
        title = fullTitle?.split(' - ')[0]
        album = fullTitle?.split(' - ')[1]
      }

      resources.push({ type, title, source, authors, audioType, album })
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

  async addMusic(path: string, title: string, album: string, authors: string[], audioType: AudioType) {
    await this.clickOnElement('[data-add-resource]')
    await this.clickOnElement('[data-add-audio-resource]')

    await this.typeText('[data-add-music-title] input', title)
    await this.typeText('[data-add-music-album] input', album)
    await this.typeText('[data-add-music-authors] input', authors.join(';'))

    if (audioType === 'playback') {
      await this.clickOnElement('[data-add-music-type]')
    }

    const input = await this.getBySelector('[data-dropzone-container="music"] input[type="file"]')
    await input.uploadFile(path)

    await page.waitFor(500)
    await this.clickOnElement('[data-button-submit]')

    await this.waitForTextByCss('[data-resource-title]', title)
  }
}