export default abstract class BasePage {
  protected url: string
  protected pageLoadedSelector: string
  private appUrl: string = process.env.APP_URL ? process.env.APP_URL : 'http://localhost:3000'

  protected constructor(url: string, pageLoadedSelector: string) {
    this.url = url
    this.pageLoadedSelector = pageLoadedSelector
  }

  async waitForPageLoaded() {
    await page.waitForSelector(this.pageLoadedSelector)
  }

  async goTo() {
    await page.goto(`${this.appUrl}${this.url}`, { waitUntil: 'networkidle2' })
    await this.waitForPageLoaded()
  }

  async clickOnBundle(bundleName: string) {
    const bundle = await page.$(`[data-bundle-name='${bundleName}']`)

    if (bundle) {
      await bundle.click()
    } else {
      throw new Error(`Bundle not found: ${bundle}`)
    }
  }

  getCurrentPageUrl(): string {
    return page.url()
  }
}