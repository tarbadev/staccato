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
}