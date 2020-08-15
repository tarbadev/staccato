export default abstract class BasePage {
  protected url: string
  protected pageLoadedSelector: string
  private appUrl: string = process.env.APP_URL ? process.env.APP_URL : 'http://localhost:3000'

  protected constructor(url: string, pageLoadedSelector: string) {
    this.url = url
    this.pageLoadedSelector = pageLoadedSelector
  }

  async goTo() {
    await page.goto(`${this.appUrl}${this.url}`, { waitUntil: 'networkidle2' })
    await page.waitForSelector(this.pageLoadedSelector)
  }
}