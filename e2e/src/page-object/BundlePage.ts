import BasePage from './BasePage'

export default class BundlePage extends BasePage {
  constructor() {
    super('/bundles/', 'div#bundle-detail')
  }
}