import BasePage from './BasePage'

export default class BundlePage extends BasePage {
  constructor(id: number|string) {
    super(`/bundles/${id}`, 'div#bundle-detail')
  }

  getTitle(): Promise<string> {
    return this.getTextContentBySelector('[data-bundle-name]')
  }
}